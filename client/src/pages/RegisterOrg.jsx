import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { Building2, Mail, Lock, User, ArrowRight, Loader2, Database } from 'lucide-react';

const RegisterOrg = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { registerOrg } = useAuth();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [serverError, setServerError] = useState('');

    const onSubmit = async (data) => {
        setIsLoading(true);
        setServerError('');

        const result = await registerOrg(data);

        if (result.success) {
            navigate('/dashboard');
        } else {
            setServerError(result.error);
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 font-sans flex items-center justify-center p-6">
            <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row border border-slate-200 fade-in">

                {/* Left Side - Branding/Info */}
                <div className="w-full md:w-5/12 bg-gradient-to-br from-blue-900 to-slate-900 text-white p-12 flex flex-col justify-between hidden md:flex relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/20 rounded-full blur-3xl -mr-20 -mt-20"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl -ml-20 -mb-20"></div>

                    <div className="relative z-10">
                        <div className="flex items-center space-x-2 mb-12">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-lg flex items-center justify-center shadow-lg">
                                <Database className="w-6 h-6 text-white" />
                            </div>
                            <span className="font-display text-2xl font-bold">KnowledgeRAG</span>
                        </div>

                        <h1 className="font-display text-4xl font-bold mb-6 leading-tight">
                            Set up your secure workspace.
                        </h1>
                        <p className="text-blue-200 text-lg leading-relaxed">
                            Create an isolated environment for your organization's documents. Your data stays yours, securely encrypted and instantly searchable.
                        </p>
                    </div>

                    <div className="relative z-10">
                        <div className="flex items-center space-x-3 text-sm text-blue-300">
                            <div className="w-8 h-8 rounded-full bg-blue-800/50 flex items-center justify-center border border-blue-700">
                                <User className="w-4 h-4" />
                            </div>
                            <span>You'll be set as the Organization Admin</span>
                        </div>
                    </div>
                </div>

                {/* Right Side - Form */}
                <div className="w-full md:w-7/12 p-8 md:p-12">
                    <div className="max-w-md mx-auto">
                        <h2 className="font-display text-3xl font-bold text-slate-900 mb-2">Create Organization</h2>
                        <p className="text-slate-500 mb-8">Fill in your details to get started.</p>

                        {serverError && (
                            <div className="mb-6 p-4 bg-red-50 text-red-600 border border-red-200 rounded-xl text-sm flex items-center">
                                <span>{serverError}</span>
                            </div>
                        )}

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

                            {/* Org Details Split */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Organization Name</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Building2 className="h-5 w-5 text-slate-400" />
                                        </div>
                                        <input
                                            type="text"
                                            {...register("orgName", { required: "Required" })}
                                            className="block w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-colors"
                                            placeholder="Acme Corp"
                                        />
                                    </div>
                                    {errors.orgName && <p className="mt-1 text-xs text-red-500">{errors.orgName.message}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
                                    <select
                                        {...register("orgType", { required: "Required" })}
                                        className="block w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-colors appearance-none"
                                    >
                                        <option value="">Select type...</option>
                                        <option value="COMPANY">Company</option>
                                        <option value="SCHOOL">School</option>
                                        <option value="UNIVERSITY">University</option>
                                        <option value="HOSPITAL">Hospital</option>
                                        <option value="GOVERNMENT">Government</option>
                                        <option value="OTHER">Other</option>
                                    </select>
                                    {errors.orgType && <p className="mt-1 text-xs text-red-500">{errors.orgType.message}</p>}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Description (Optional)</label>
                                <textarea
                                    {...register("description")}
                                    rows="2"
                                    className="block w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-colors resize-none"
                                    placeholder="What does your organization do?"
                                />
                            </div>

                            <div className="relative py-3">
                                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                                    <div className="w-full border-t border-slate-200"></div>
                                </div>
                                <div className="relative flex justify-center">
                                    <span className="px-3 bg-white text-xs font-medium text-slate-500 uppercase tracking-wider">Admin Profile</span>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Admin Name</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <User className="h-5 w-5 text-slate-400" />
                                    </div>
                                    <input
                                        type="text"
                                        {...register("adminName", { required: "Required" })}
                                        className="block w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-colors"
                                        placeholder="John Doe"
                                    />
                                </div>
                                {errors.adminName && <p className="mt-1 text-xs text-red-500">{errors.adminName.message}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Work Email</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Mail className="h-5 w-5 text-slate-400" />
                                    </div>
                                    <input
                                        type="email"
                                        {...register("adminEmail", {
                                            required: "Required",
                                            pattern: { value: /^\S+@\S+$/i, message: "Invalid email" }
                                        })}
                                        className="block w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-colors"
                                        placeholder="john@acme.com"
                                    />
                                </div>
                                {errors.adminEmail && <p className="mt-1 text-xs text-red-500">{errors.adminEmail.message}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-slate-400" />
                                    </div>
                                    <input
                                        type="password"
                                        {...register("adminPassword", {
                                            required: "Required",
                                            minLength: { value: 6, message: "Minimum 6 characters" }
                                        })}
                                        className="block w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-colors"
                                        placeholder="••••••••"
                                    />
                                </div>
                                {errors.adminPassword && <p className="mt-1 text-xs text-red-500">{errors.adminPassword.message}</p>}
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-br from-blue-600 to-cyan-500 text-white rounded-xl font-medium hover:from-blue-700 hover:to-cyan-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-lg hover:shadow-xl mt-6"
                            >
                                {isLoading ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <>
                                        <span>Create Workspace</span>
                                        <ArrowRight className="w-5 h-5 ml-2" />
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="mt-8 text-center text-sm text-slate-600">
                            Already have an account?{' '}
                            <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500 transition-colors">
                                Sign in
                            </Link>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterOrg;
