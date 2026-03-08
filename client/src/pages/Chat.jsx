import React from 'react';
import { useAuth } from '../context/AuthContext';
import { MessageSquare, ArrowRight } from 'lucide-react';

const Chat = () => {
    const { user, organization } = useAuth();

    return (
        <div className="flex-1 flex flex-col h-full bg-slate-50">
            {/* Minimal Header */}
            <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shadow-sm">
                <div>
                    <h1 className="font-semibold text-slate-900 text-lg">Ask {organization?.name || "Workspace"}</h1>
                    <p className="text-sm text-slate-500">Get context-aware answers from your organization's data.</p>
                </div>
            </header>

            {/* Chat Area (Placeholder for now) */}
            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">

                {/* Empty State */}
                <div className="m-auto text-center max-w-md">
                    <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <MessageSquare className="w-8 h-8 text-blue-600" />
                    </div>
                    <h2 className="text-2xl font-display font-bold text-slate-900 mb-3">How can I help you today, {user?.username?.split(' ')[0]}?</h2>
                    <p className="text-slate-500 mb-8">
                        I can answer questions based on the documents uploaded to the {organization?.name} knowledge base.
                    </p>

                    <div className="grid grid-cols-1 gap-3 text-left">
                        <button className="p-4 bg-white border border-slate-200 rounded-xl hover:border-blue-400 hover:shadow-md transition-all text-sm text-slate-700 flex justify-between items-center group">
                            <span>What are our company policies?</span>
                            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-500" />
                        </button>
                        <button className="p-4 bg-white border border-slate-200 rounded-xl hover:border-blue-400 hover:shadow-md transition-all text-sm text-slate-700 flex justify-between items-center group">
                            <span>Summarize the latest project specs</span>
                            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-500" />
                        </button>
                    </div>
                </div>

            </div>

            {/* Input Area */}
            <div className="p-6 bg-white border-t border-slate-200">
                <div className="max-w-4xl mx-auto relative">
                    <input
                        type="text"
                        placeholder="Type your question here..."
                        className="w-full pl-4 pr-14 py-4 bg-slate-50 border border-slate-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all text-slate-900 shadow-sm"
                    />
                    <button className="absolute right-2 top-2 bottom-2 w-10 bg-blue-600 hover:bg-blue-700 transition-colors rounded-xl flex items-center justify-center text-white">
                        <ArrowRight className="w-5 h-5" />
                    </button>
                    <div className="text-center mt-3">
                        <span className="text-xs text-slate-400">AI can make mistakes. Verify important information.</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Chat;
