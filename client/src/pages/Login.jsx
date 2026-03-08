import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, ArrowRight, Loader2, Database } from 'lucide-react';

const Login = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { login } = useAuth();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [serverError, setServerError] = useState('');

    const onSubmit = async (data) => {
        setIsLoading(true);
        setServerError('');

        const result = await login(data.email, data.password);

        if (result.success) {
            if (result.user?.role === 'ADMIN') {
                navigate('/dashboard');
            } else {
                navigate('/chat');
            }
        } else {
            setServerError(result.error);
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 font-sans flex items-center justify-center p-6 relative overflow-hidden">

            {/* Decorative Blobs */}
            <div className="absolute top-1/4 -left-48 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl blob-left"></div>
            <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl blob-right"></div>

            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 p-8 relative z-10 fade-in card-hover mb-12">
                <div className="text-center mb-8">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg mx-auto mb-4">
                        <Database className="w-7 h-7 text-white" />
                    </div>
                    <h1 className="font-display text-3xl font-bold text-slate-900 mb-2">Welcome Back</h1>
                    <p className="text-slate-500">Sign in to your organization workspace</p>
                </div>

                {serverError && (
                    <div className="mb-6 p-4 bg-red-50 text-red-600 border border-red-200 rounded-xl text-sm flex items-center">
                        <span>{serverError}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Work Email</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Mail className="h-5 w-5 text-slate-400" />
                            </div>
                            <input
                                type="email"
                                {...register("email", {
                                    required: "Email is required",
                                    pattern: { value: /^\S+@\S+$/i, message: "Invalid email address" }
                                })}
                                className="block w-full pl-10 pr-3 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-colors"
                                placeholder="name@company.com"
                            />
                        </div>
                        {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
                    </div>

                    <div>
                        <div className="flex items-center justify-between mb-1">
                            <label className="block text-sm font-medium text-slate-700">Password</label>
                        </div>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock className="h-5 w-5 text-slate-400" />
                            </div>
                            <input
                                type="password"
                                {...register("password", { required: "Password is required" })}
                                className="block w-full pl-10 pr-3 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-colors"
                                placeholder="••••••••"
                            />
                        </div>
                        {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full flex items-center justify-center px-4 py-3.5 bg-gradient-to-br from-blue-600 to-cyan-500 text-white rounded-xl font-medium hover:from-blue-700 hover:to-cyan-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-lg hover:shadow-xl mt-8"
                    >
                        {isLoading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <>
                                <span>Sign In</span>
                                <ArrowRight className="w-5 h-5 ml-2" />
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-8 text-center text-sm text-slate-600">
                    Don't have a workspace yet?{' '}
                    <Link to="/register-org" className="font-medium text-blue-600 hover:text-blue-500 transition-colors">
                        Create an Organization
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
