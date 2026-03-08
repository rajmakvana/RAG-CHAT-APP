import React, { useState, useEffect } from 'react';
import { Navigate, Outlet, NavLink, useLocation } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { Database, LogOut, MessageSquare, Menu, X } from 'lucide-react';

const AppLayout = () => {
    const { user, organization, logout } = useAuth();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const location = useLocation();

    // Close sidebar when route changes on mobile
    useEffect(() => {
        setIsSidebarOpen(false);
    }, [location.pathname]);

    if (!user) return <Navigate to="/login" replace />;

    const isAdmin = user.role === 'ADMIN';

    return (
        <div className="flex h-screen bg-slate-50 font-sans overflow-hidden">

            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-30 md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`fixed inset-y-0 left-0 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 transition duration-200 ease-in-out w-64 bg-slate-900 text-white flex flex-col flex-shrink-0 z-40 shadow-2xl md:shadow-none`}>

                {/* Header - Org Info */}
                <div className="p-4 border-b border-slate-800 flex justify-between items-center">
                    <div className="flex items-center space-x-2 flex-1 min-w-0">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Database className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-display font-bold text-lg truncate block">
                            {organization?.name || "Workspace"}
                        </span>
                    </div>
                    {/* Close button for mobile */}
                    <button
                        onClick={() => setIsSidebarOpen(false)}
                        className="md:hidden text-slate-400 hover:text-white p-1 rounded-md ml-2 flex-shrink-0"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-4 border-b border-slate-800">
                    <div className="flex items-center space-x-3 bg-slate-800 p-2 rounded-lg">
                        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-sm font-bold uppercase overflow-hidden">
                            {user.avatarUrl ? (
                                <img src={user.avatarUrl} alt="avatar" className="w-full h-full object-cover" />
                            ) : (
                                user.username?.charAt(0) || 'U'
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white truncate">{user.username}</p>
                            <p className="text-xs text-slate-400 truncate capitalize">{user.role.toLowerCase()}</p>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto p-4 space-y-2">
                    <NavLink
                        to="/chat"
                        className={({ isActive }) =>
                            `flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors ${isActive ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`
                        }
                    >
                        <MessageSquare className="w-5 h-5" />
                        <span className="font-medium">Chat</span>
                    </NavLink>

                    {isAdmin && (
                        <>
                            <div className="pt-4 pb-1">
                                <p className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                    Administration
                                </p>
                            </div>

                            <NavLink
                                to="/dashboard"
                                end
                                className={({ isActive }) =>
                                    `flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors ${isActive ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`
                                }
                            >
                                <Database className="w-5 h-5" />
                                <span className="font-medium">Admin Dashboard</span>
                            </NavLink>
                        </>
                    )}
                </nav>

                {/* Footer actions */}
                <div className="p-4 border-t border-slate-800">
                    <button
                        onClick={logout}
                        className="flex items-center space-x-3 px-3 py-2.5 w-full rounded-lg text-slate-300 hover:bg-red-900/40 hover:text-red-400 transition-colors"
                    >
                        <LogOut className="w-5 h-5" />
                        <span className="font-medium">Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col relative z-10 w-full min-w-0 md:w-auto h-screen overflow-hidden">
                {/* Mobile Header */}
                <header className="md:hidden flex items-center justify-between bg-white border-b border-slate-200 p-4 shrink-0 shadow-sm z-20">
                    <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-lg flex items-center justify-center">
                            <Database className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-display font-bold text-lg truncate text-slate-900">
                            {organization?.name || "Workspace"}
                        </span>
                    </div>
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="text-slate-600 hover:text-slate-900 p-1 bg-slate-100 rounded-md"
                    >
                        <Menu className="w-6 h-6" />
                    </button>
                </header>

                <div className="flex-1 overflow-auto flex flex-col relative w-full h-full">
                    <Outlet />
                </div>
            </main>

        </div>
    );
};

export default AppLayout;
