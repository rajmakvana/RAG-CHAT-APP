import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [organization, setOrganization] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (token && storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                setUser(parsedUser);

                // If user has an org, fetch org details
                if (parsedUser.organizationId) {
                    await fetchOrganization();
                }
            } catch (error) {
                console.error("Error restoring session:", error);
                logout();
            }
        }
        setIsLoading(false);
    };

    const fetchOrganization = async () => {
        try {
            const response = await api.get('/api/v1/org');
            if (response.data.success) {
                const orgData = response.data.organization;
                setOrganization(orgData);

                // Update user details from the organization's user list to ensure we have fresh data
                // (like username and avatarUrl) without a separate /me endpoint.
                if (orgData.users && orgData.users.length > 0) {
                    const storedUser = localStorage.getItem('user');
                    const parsedStoredUser = storedUser ? JSON.parse(storedUser) : null;

                    // Match by ID if available, otherwise fallback to email
                    const currentUserDetails = orgData.users.find(u =>
                        (parsedStoredUser?.id && u.id === parsedStoredUser.id) ||
                        (u.email === parsedStoredUser?.email)
                    );

                    if (currentUserDetails) {
                        const updatedUser = { ...parsedStoredUser, ...currentUserDetails };
                        setUser(updatedUser);
                        localStorage.setItem('user', JSON.stringify(updatedUser));
                    }
                }
            }
        } catch (error) {
            console.error("Failed to fetch organization:", error);
        }
    }

    const login = async (email, password) => {
        try {
            const response = await api.post('/api/v1/user/login', { email, password });

            if (response.data.success) {
                const { token, user: userData } = response.data;

                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify(userData));

                setUser(userData);
                if (userData.organizationId) {
                    await fetchOrganization();
                }
                return { success: true, user: userData };
            }
            return { success: false, error: response.data.message || 'Login failed' };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Network error occurred'
            };
        }
    };

    const registerOrg = async (orgData) => {
        try {
            const response = await api.post('/api/v1/org/register', orgData);

            if (response.data.success) {
                const { token, user: userData, organization: orgDetails } = response.data;

                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify(userData));

                setUser(userData);
                setOrganization(orgDetails);
                return { success: true };
            }
            return { success: false, error: response.data.message || 'Registration failed' };
        } catch (error) {
            // extract validation errors from express-validator if they exist
            const errorMsg = error.response?.data?.errors
                ? error.response.data.errors.map(e => e.msg).join(', ')
                : error.response?.data?.message || 'Network error occurred';

            return {
                success: false,
                error: errorMsg
            };
        }
    };

    const acceptInvite = async (token, userData) => {
        try {
            const response = await api.post(`/api/v1/org/accept-invite/${token}`, userData);
            if (response.data.success) {
                const { token: jwt, user: newUserData } = response.data;

                localStorage.setItem('token', jwt);
                localStorage.setItem('user', JSON.stringify(newUserData));

                setUser(newUserData);
                await fetchOrganization();
                return { success: true, user: newUserData };
            }
            return { success: false, error: "Failed to accept invite" };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || "Failed to process invitation"
            }
        }
    }

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        setOrganization(null);
    };

    const value = {
        user,
        organization,
        isLoading,
        login,
        registerOrg,
        acceptInvite,
        logout,
        fetchOrganization
    };

    return (
        <AuthContext.Provider value={value}>
            {!isLoading && children}
        </AuthContext.Provider>
    );
};
