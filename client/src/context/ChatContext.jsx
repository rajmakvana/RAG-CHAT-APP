import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import ChatService from '../services/ChatService';
import { useAuth } from './AuthContext';

const ChatContext = createContext();

export const useChat = () => {
    const context = useContext(ChatContext);
    if (!context) {
        throw new Error('useChat must be used within a ChatProvider');
    }
    return context;
};

export const ChatProvider = ({ children }) => {
    const { user } = useAuth();
    const [threads, setThreads] = useState([]);
    const [activeThreadId, setActiveThreadId] = useState(null);
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isThreadsLoading, setIsThreadsLoading] = useState(false);

    const fetchThreads = useCallback(async () => {
        if (!user) return;
        setIsThreadsLoading(true);
        try {
            const data = await ChatService.getThreads();
            if (data.success) {
                setThreads(data.threads);
            }
        } catch (error) {
            console.error("Failed to fetch threads:", error);
        } finally {
            setIsThreadsLoading(false);
        }
    }, [user]);

    const fetchMessages = useCallback(async (threadId) => {
        try {
            const data = await ChatService.getThreadMessages(threadId);
            if (data.success) {
                setMessages(data.messages);
            }
        } catch (error) {
            console.error("Failed to fetch messages:", error);
        }
    }, []);

    const sendMessage = async (question) => {
        if (!question.trim() || isLoading) return;

        // Optimistic update
        const tempUserMsg = { id: Date.now(), role: 'USER', content: question, createdAt: new Date() };
        setMessages(prev => [...prev, tempUserMsg]);
        setIsLoading(true);

        try {
            const data = await ChatService.sendMessage(question, activeThreadId);
            if (data.success) {
                const [userMsg, botMsg] = data.result;
                setMessages(prev => {
                    const withoutOptimistic = prev.filter(m => m.id !== tempUserMsg.id);
                    return [...withoutOptimistic, userMsg, { ...botMsg, isTyping: true }];
                });

                if (!activeThreadId) {
                    setActiveThreadId(userMsg.threadId);
                    fetchThreads(); // Refresh threads list
                }
                return data;
            }
        } catch (error) {
            console.error("Failed to send message:", error);
            // Optionally remove optimistic message or show error
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const deleteThread = async (threadId) => {
        try {
            const data = await ChatService.deleteThread(threadId);
            if (data.success) {
                setThreads(prev => prev.filter(t => t.id !== threadId));
                if (activeThreadId === threadId) {
                    setActiveThreadId(null);
                    setMessages([]);
                }
                return true;
            }
        } catch (error) {
            console.error("Failed to delete thread:", error);
            return false;
        }
    };

    const startNewChat = () => {
        setActiveThreadId(null);
        setMessages([]);
    };

    useEffect(() => {
        if (user) {
            fetchThreads();
        } else {
            setThreads([]);
            setActiveThreadId(null);
            setMessages([]);
        }
    }, [user, fetchThreads]);

    useEffect(() => {
        if (activeThreadId) {
            fetchMessages(activeThreadId);
        }
    }, [activeThreadId, fetchMessages]);

    return (
        <ChatContext.Provider value={{
            threads,
            activeThreadId,
            setActiveThreadId,
            messages,
            setMessages,
            isLoading,
            isThreadsLoading,
            fetchThreads,
            sendMessage,
            deleteThread,
            startNewChat
        }}>
            {children}
        </ChatContext.Provider>
    );
};
