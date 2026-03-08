import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import {
    User,
    Bot,
    Send,
    ArrowRight,
    Copy,
    Check,
    Plus
} from 'lucide-react';
import { useChat } from '../context/ChatContext';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
    return twMerge(clsx(inputs));
}

const CodeBlock = ({ node, inline, className, children, ...props }) => {
    const match = /language-(\w+)/.exec(className || '');
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(String(children).replace(/\n$/, ''));
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return !inline && match ? (
        <div className="relative group my-4">
            <div className="absolute right-2 top-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                    onClick={handleCopy}
                    className="p-1.5 bg-slate-800/50 hover:bg-slate-700/50 rounded-md text-slate-400 hover:text-white transition-colors border border-slate-700/50"
                    title="Copy code"
                >
                    {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                </button>
            </div>
            <SyntaxHighlighter
                style={oneDark}
                language={match[1]}
                PreTag="div"
                className="rounded-xl !bg-slate-900 !m-0 border border-slate-800"
                {...props}
            >
                {String(children).replace(/\n$/, '')}
            </SyntaxHighlighter>
        </div>
    ) : (
        <code className={cn("bg-slate-100 text-slate-900 px-1.5 py-0.5 rounded-md font-mono text-sm", className)} {...props}>
            {children}
        </code>
    );
};

const LoadingDots = () => (
    <div className="flex space-x-1 items-center h-4 py-2 px-1">
        <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 1, delay: 0 }}
            className="w-1.5 h-1.5 bg-slate-400 rounded-full"
        />
        <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 1, delay: 0.2 }}
            className="w-1.5 h-1.5 bg-slate-400 rounded-full"
        />
        <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 1, delay: 0.4 }}
            className="w-1.5 h-1.5 bg-slate-400 rounded-full"
        />
    </div>
);

const Typewriter = ({ text, delay = 80, onComplete }) => {
    const [displayedText, setDisplayedText] = useState("");
    const [currentIndex, setCurrentIndex] = useState(0);
    const words = useRef(text.split(" "));

    useEffect(() => {
        if (currentIndex < words.current.length) {
            const timeout = setTimeout(() => {
                setDisplayedText((prev) =>
                    prev + (currentIndex === 0 ? "" : " ") + words.current[currentIndex]
                );
                setCurrentIndex((prev) => prev + 1);
            }, delay);
            return () => clearTimeout(timeout);
        } else if (onComplete) {
            onComplete();
        }
    }, [currentIndex, delay, onComplete]);

    return (
        <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
                code: CodeBlock
            }}
        >
            {displayedText}
        </ReactMarkdown>
    );
};

const Chat = () => {
    const { user, organization } = useAuth();
    const {
        messages,
        setMessages,
        isLoading,
        sendMessage,
        startNewChat
    } = useChat();

    const [input, setInput] = useState('');
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading]);

    const handleSendMessage = async (e) => {
        e?.preventDefault();
        if (!input.trim() || isLoading) return;

        const question = input.trim();
        setInput('');

        try {
            await sendMessage(question);
        } catch (error) {
            console.error("Failed to send message:", error);
        }
    };

    return (
        <div className="flex-1 flex flex-col h-full bg-slate-50 overflow-hidden relative">
            {/* Header - Mobile Only or for extra context */}
            <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10 shrink-0">
                <div>
                    <h1 className="font-semibold text-slate-900 leading-tight flex items-center gap-2">
                        <Bot className="w-5 h-5 text-blue-600" />
                        Ask {organization?.name || "Workspace"}
                    </h1>
                    <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider mt-0.5">Using AI with organization knowledge</p>
                </div>
                <button
                    onClick={startNewChat}
                    className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors"
                    title="New Chat"
                >
                    <Plus className="w-5 h-5" />
                </button>
            </header>

            {/* Messages container */}
            <div className="flex-1 overflow-y-auto px-4 md:px-0 scroll-smooth">
                <div className="max-w-3xl mx-auto py-8 space-y-8">
                    {messages.length === 0 && !isLoading ? (
                        <div className="text-center space-y-8 pt-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
                            <div className="w-24 h-24 bg-gradient-to-br from-blue-50 to-white rounded-[2rem] flex items-center justify-center mx-auto shadow-xl shadow-blue-500/5 border border-blue-100/50">
                                <Bot className="w-12 h-12 text-blue-600" />
                            </div>
                            <div className="space-y-3">
                                <h2 className="text-4xl font-bold text-slate-900 tracking-tight">
                                    How can I help you, {user?.username?.split(' ')[0]}?
                                </h2>
                                <p className="text-slate-500 max-w-sm mx-auto text-lg leading-relaxed">
                                    I'm ready to answer any questions about the {organization?.name} knowledge base.
                                </p>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-12 text-left px-4 max-w-2xl mx-auto">
                                {[
                                    "What are our company policies?",
                                    "Summarize recent project specs",
                                    "How to request leave?",
                                    "Explain technical architecture"
                                ].map((suggestion, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => { setInput(suggestion); }}
                                        className="p-5 bg-white border border-slate-200/60 rounded-2xl hover:border-blue-300 hover:shadow-xl hover:shadow-blue-500/5 transition-all text-sm text-slate-700 flex justify-between items-center group active:scale-[0.98] animate-in fade-in slide-in-from-bottom-2"
                                        style={{ animationDelay: `${idx * 100}ms` }}
                                    >
                                        <span className="truncate font-medium">{suggestion}</span>
                                        <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <>
                            {messages.map((msg, index) => (
                                <div
                                    key={msg.id || index}
                                    className={cn(
                                        "flex gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300",
                                        msg.role === 'USER' ? "flex-row-reverse" : "flex-row"
                                    )}
                                >
                                    <div className={cn(
                                        "w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-md transition-transform hover:scale-105",
                                        msg.role === 'USER' ? "bg-slate-800 text-white" : "bg-gradient-to-br from-blue-600 to-cyan-500 text-white"
                                    )}>
                                        {msg.role === 'USER' ? <User className="w-6 h-6" /> : <Bot className="w-6 h-6" />}
                                    </div>
                                    <div className={cn(
                                        "max-w-[85%] space-y-1.5",
                                        msg.role === 'USER' ? "items-end text-right" : "items-start text-left"
                                    )}>
                                        <div className={cn(
                                            "px-5 py-3.5 rounded-3xl text-[0.9375rem] leading-relaxed shadow-sm transition-all",
                                            msg.role === 'USER'
                                                ? "bg-slate-800 text-white rounded-tr-none hover:bg-slate-700"
                                                : "bg-white text-slate-800 border border-slate-200/80 rounded-tl-none prose prose-slate max-w-none hover:border-blue-200/50"
                                        )}>
                                            {msg.role === 'USER' ? (
                                                msg.content
                                            ) : (
                                                msg.isTyping ? (
                                                    <Typewriter
                                                        text={msg.content}
                                                        delay={120}
                                                        onComplete={() => {
                                                            setMessages(prev =>
                                                                prev.map(m => m.id === msg.id ? { ...m, isTyping: false } : m)
                                                            );
                                                        }}
                                                    />
                                                ) : (
                                                    <ReactMarkdown
                                                        remarkPlugins={[remarkGfm]}
                                                        components={{
                                                            code: CodeBlock
                                                        }}
                                                    >
                                                        {msg.content}
                                                    </ReactMarkdown>
                                                )
                                            )}
                                        </div>
                                        <span className="text-[10px] text-slate-400 px-2 font-medium tracking-wide">
                                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                </div>
                            ))}
                            {isLoading && (
                                <div className="flex gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 text-white flex items-center justify-center shadow-md">
                                        <Bot className="w-6 h-6" />
                                    </div>
                                    <div className="bg-white p-4 rounded-3xl rounded-tl-none border border-slate-200/80 shadow-sm">
                                        <LoadingDots />
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                    <div ref={messagesEndRef} className="h-4" />
                </div>
            </div>

            {/* Input Area container */}
            <div className="p-4 md:p-8 shrink-0 bg-gradient-to-t from-slate-50 via-slate-50/80 to-transparent">
                <form
                    onSubmit={handleSendMessage}
                    className="max-w-3xl mx-auto group"
                >
                    <div className="relative flex items-center drop-shadow-2xl translate-z-0">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Type your message here..."
                            disabled={isLoading}
                            className="w-full pl-6 pr-16 py-5 bg-white border border-slate-300/60 rounded-[1.5rem] focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/50 transition-all text-slate-900 shadow-[0_8px_30px_rgb(0,0,0,0.04)] placeholder:text-slate-400 disabled:bg-slate-50 disabled:cursor-not-allowed text-[1rem]"
                        />
                        <button
                            type="submit"
                            disabled={!input.trim() || isLoading}
                            className="absolute right-3 p-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-all rounded-[1rem] text-white shadow-lg shadow-blue-600/20 active:scale-90 group-focus-within:translate-x-0"
                        >
                            <Send className="w-5 h-5" />
                        </button>
                    </div>
                    <div className="flex items-center justify-center gap-2 mt-4 opacity-50 hover:opacity-100 transition-opacity">
                        <span className="w-1 h-1 bg-slate-400 rounded-full" />
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.1em]">
                            AI can make mistakes. Verify important info.
                        </p>
                        <span className="w-1 h-1 bg-slate-400 rounded-full" />
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Chat;
