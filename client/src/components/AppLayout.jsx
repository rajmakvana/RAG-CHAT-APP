import React, { useState, useEffect } from 'react';
import { Navigate, Outlet, NavLink, useLocation } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { useChat } from '../context/ChatContext';
import {
    Database,
    LogOut,
    MessageSquare,
    Menu,
    X,
    Plus,
    Trash2,
    ChevronRight
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
    return twMerge(clsx(inputs));
}

const AppLayout = () => {
    const { user, organization, logout } = useAuth();
    const {
        threads,
        activeThreadId,
        setActiveThreadId,
        deleteThread,
        startNewChat,
        isThreadsLoading
    } = useChat();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const location = useLocation();

    const isChatPage = location.pathname === '/chat';

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
            <aside className={cn(
                "fixed inset-y-0 left-0 transform md:relative md:translate-x-0 transition-transform duration-300 ease-in-out w-72 bg-slate-900 text-white flex flex-col flex-shrink-0 z-40 shadow-2xl md:shadow-none",
                isSidebarOpen ? "translate-x-0" : "-translate-x-full"
            )}>

                {/* Header - Org Info */}
                <div className="p-5 border-b border-slate-800 flex justify-between items-center">
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                        <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-500/20">
                            <Database className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-display font-bold text-lg truncate block">
                            {organization?.name || "Workspace"}
                        </span>
                    </div>
                    {/* Close button for mobile */}
                    <button
                        onClick={() => setIsSidebarOpen(false)}
                        className="md:hidden text-slate-400 hover:text-white p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors ml-2 flex-shrink-0"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* User Info Card */}
                <div className="p-4 pt-6">
                    <div className="flex items-center space-x-3 bg-slate-800/50 border border-slate-700/50 p-2.5 rounded-xl">
                        <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center text-sm font-bold uppercase overflow-hidden shadow-inner">
                            {user.avatarUrl ? (
                                <img src={user.avatarUrl} alt="avatar" className="w-full h-full object-cover" />
                            ) : (
                                user.username?.charAt(0) || 'U'
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-white truncate">{user.username}</p>
                            <p className="text-[10px] text-slate-400 truncate uppercase tracking-wider font-bold">{user.role}</p>
                        </div>
                    </div>
                </div>

                {/* Navigation & Thread History */}
                <div className="flex-1 overflow-y-auto px-4 py-2 space-y-6 scrollbar-hide">

                    {/* Primary Links */}
                    <div className="space-y-1">
                        <NavLink
                            to="/chat"
                            className={({ isActive }) => cn(
                                "flex items-center justify-between px-3 py-2.5 rounded-xl transition-all group",
                                isActive ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20 shadow-lg shadow-blue-500/5' : 'text-slate-400 hover:bg-slate-800/80 hover:text-white'
                            )}
                        >
                            <div className="flex items-center space-x-3">
                                <MessageSquare className="w-5 h-5" />
                                <span className="font-medium">Chat</span>
                            </div>
                            <ChevronRight className={cn("w-4 h-4 opacity-0 group-hover:opacity-100 transition-all", location.pathname === '/chat' && "opacity-100")} />
                        </NavLink>

                        {isAdmin && (
                            <NavLink
                                to="/dashboard"
                                end
                                className={({ isActive }) => cn(
                                    "flex items-center justify-between px-3 py-2.5 rounded-xl transition-all group",
                                    isActive ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20 shadow-lg shadow-blue-500/5' : 'text-slate-400 hover:bg-slate-800/80 hover:text-white'
                                )}
                            >
                                <div className="flex items-center space-x-3">
                                    <Database className="w-5 h-5" />
                                    <span className="font-medium">Dashboard</span>
                                </div>
                                <ChevronRight className={cn("w-4 h-4 opacity-0 group-hover:opacity-100 transition-all", location.pathname === '/dashboard' && "opacity-100")} />
                            </NavLink>
                        )}
                    </div>

                    {/* Chat History Section - Only visible on Chat Page or if threads exist */}
                    {(isChatPage || threads.length > 0) && (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between px-3">
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">
                                    History
                                </p>
                                <button
                                    onClick={startNewChat}
                                    className="p-1 hover:bg-slate-800 rounded-md text-slate-400 hover:text-blue-400 transition-all"
                                    title="New Chat"
                                >
                                    <Plus className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="space-y-1">
                                {isThreadsLoading ? (
                                    [1, 2, 3].map(i => (
                                        <div key={i} className="h-10 bg-slate-800/30 rounded-lg animate-pulse mx-1" />
                                    ))
                                ) : threads.length === 0 ? (
                                    <p className="px-3 text-xs text-slate-600 italic">No recent chats</p>
                                ) : (
                                    threads.map((thread) => (
                                        <div
                                            key={thread.id}
                                            className={cn(
                                                "group flex items-center justify-between px-3 py-2 rounded-xl text-sm transition-all cursor-pointer",
                                                activeThreadId === thread.id
                                                    ? "bg-slate-800 text-blue-400 border border-slate-700 shadow-sm"
                                                    : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
                                            )}
                                            onClick={() => {
                                                if (!isChatPage) window.location.href = '/chat';
                                                setActiveThreadId(thread.id);
                                            }}
                                        >
                                            <div className="flex items-center space-x-3 overflow-hidden">
                                                <MessageSquare className={cn("w-4 h-4 shrink-0", activeThreadId === thread.id ? "text-blue-500" : "text-slate-600")} />
                                                <span className="truncate font-medium">{thread.title}</span>
                                            </div>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    deleteThread(thread.id);
                                                }}
                                                className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-900/20 hover:text-red-400 rounded-md transition-all flex-shrink-0"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Actions */}
                <div className="p-4 border-t border-slate-800 mt-auto">
                    <button
                        onClick={logout}
                        className="flex items-center space-x-3 px-4 py-3 w-full rounded-xl text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all font-medium border border-transparent hover:border-red-500/20"
                    >
                        <LogOut className="w-5 h-5" />
                        <span>Sign Out</span>
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
