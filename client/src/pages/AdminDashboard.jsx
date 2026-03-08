import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
    Database,
    FileText,
    UploadCloud,
    Users,
    Loader2,
    CheckCircle,
    AlertCircle,
    Trash2,
    Mail,
    Shield,
    Settings as SettingsIcon,
    X,
    UserPlus,
    Activity
} from 'lucide-react';
import api from '../services/api';

const AdminDashboard = () => {
    const { user, organization, fetchOrganization } = useAuth();
    const [activeTab, setActiveTab] = useState('knowledge'); // 'knowledge', 'team', 'settings'
    const [isUploading, setIsUploading] = useState(false);
    const [deletingId, setDeletingId] = useState(null);
    const [uploadStatus, setUploadStatus] = useState(null); // 'success', 'error', null
    const [statusMessage, setStatusMessage] = useState('');
    const fileInputRef = useRef(null);

    // Member Invitation State
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
    const [inviteEmail, setInviteEmail] = useState('');
    const [inviteRole, setInviteRole] = useState('USER');
    const [isInviting, setIsInviting] = useState(false);

    // Settings State
    const [settingsName, setSettingsName] = useState(organization?.name || '');
    const [settingsPrompt, setSettingsPrompt] = useState(organization?.systemPrompt || '');
    const [isSavingSettings, setIsSavingSettings] = useState(false);

    useEffect(() => {
        if (fetchOrganization) {
            fetchOrganization();
        }
    }, []);

    useEffect(() => {
        if (organization) {
            setSettingsName(organization.name);
            setSettingsPrompt(organization.systemPrompt || '');
        }
    }, [organization]);

    const handleFileSelect = async (event) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // Basic validation
        const isValidType = ['application/pdf', 'text/plain'].includes(file.type);
        if (!isValidType) {
            setUploadStatus('error');
            setStatusMessage('Only PDF and TXT files are currently supported.');
            return;
        }

        if (file.size > 10 * 1024 * 1024) {
            setUploadStatus('error');
            setStatusMessage('File size must be less than 10MB.');
            return;
        }

        setIsUploading(true);
        setUploadStatus(null);
        setStatusMessage('');

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await api.post('/api/v1/protected/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            if (response.data.success) {
                setUploadStatus('success');
                setStatusMessage('Document successfully processed and added to the knowledge base.');
                if (fetchOrganization) await fetchOrganization();
            } else {
                setUploadStatus('error');
                setStatusMessage(response.data.message || 'Failed to upload document.');
            }
        } catch (error) {
            console.error("Upload error:", error);
            setUploadStatus('error');
            setStatusMessage(error.response?.data?.message || 'An error occurred during upload.');
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const handleDeleteDataset = async (datasetId) => {
        if (!window.confirm("Are you sure? This action cannot be undone.")) return;

        setDeletingId(datasetId);
        setUploadStatus(null);

        try {
            const response = await api.delete(`/api/v1/protected/dataset/${datasetId}`);
            if (response.data.success) {
                setUploadStatus('success');
                setStatusMessage('Document deleted successfully.');
                if (fetchOrganization) await fetchOrganization();
            }
        } catch (error) {
            setUploadStatus('error');
            setStatusMessage(error.response?.data?.message || 'Failed to delete document.');
        } finally {
            setDeletingId(null);
        }
    };

    const handleInviteUser = async (e) => {
        e.preventDefault();
        setIsInviting(true);
        setUploadStatus(null);
        try {
            const response = await api.post('/api/v1/org/invite', { email: inviteEmail, role: inviteRole });
            if (response.data.success) {
                setUploadStatus('success');
                setStatusMessage(`Invitation link generated for ${inviteEmail}`);
                setIsInviteModalOpen(false);
                setInviteEmail('');
            }
        } catch (error) {
            setUploadStatus('error');
            setStatusMessage(error.response?.data?.message || 'Failed to send invitation');
        } finally {
            setIsInviting(false);
        }
    };

    const handleUpdateSettings = async (e) => {
        e.preventDefault();
        setIsSavingSettings(true);
        setUploadStatus(null);
        try {
            const response = await api.put('/api/v1/org', { name: settingsName, systemPrompt: settingsPrompt });
            if (response.data.success) {
                setUploadStatus('success');
                setStatusMessage('Settings updated successfully.');
                if (fetchOrganization) await fetchOrganization();
            }
        } catch (error) {
            setUploadStatus('error');
            setStatusMessage(error.response?.data?.message || 'Failed to update settings.');
        } finally {
            setIsSavingSettings(false);
        }
    };

    const handleRemoveMember = async (userId) => {
        if (!window.confirm("Are you sure you want to remove this member? This action will also delete their account.")) return;

        setDeletingId(userId);
        setUploadStatus(null);
        try {
            const response = await api.delete(`/api/v1/org/member/${userId}`);
            if (response.data.success) {
                setUploadStatus('success');
                setStatusMessage(response.data.message || 'Member removed successfully.');
                if (fetchOrganization) await fetchOrganization();
            }
        } catch (error) {
            setUploadStatus('error');
            setStatusMessage(error.response?.data?.message || 'Failed to remove member.');
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div className="flex-1 overflow-y-auto bg-slate-50 p-4 md:p-8">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="mb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                            Welcome back, {user?.username || 'Admin'}
                        </h1>
                        <p className="text-slate-500 mt-1">
                            Managing <span className="text-blue-600 font-semibold">{organization?.name || 'Workspace'}</span>
                        </p>
                    </div>
                    {activeTab === 'team' && (
                        <button
                            onClick={() => setIsInviteModalOpen(true)}
                            className="inline-flex items-center px-5 py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 active:scale-95"
                        >
                            <UserPlus className="w-4 h-4 mr-2" />
                            Invite Member
                        </button>
                    )}
                </div>

                {/* Tab Navigation */}
                <div className="flex border-b border-slate-200 mb-8 overflow-x-auto no-scrollbar">
                    {[
                        { id: 'knowledge', label: 'Knowledge Base', icon: Database },
                        { id: 'team', label: 'Team Members', icon: Users },
                        { id: 'settings', label: 'Settings', icon: SettingsIcon },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-6 py-4 font-semibold text-sm transition-all relative whitespace-nowrap flex items-center ${activeTab === tab.id ? 'text-blue-600' : 'text-slate-500 hover:text-slate-800'}`}
                        >
                            <tab.icon className="w-4 h-4 mr-2" />
                            {tab.label}
                            {activeTab === tab.id && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 animate-fade-in" />}
                        </button>
                    ))}
                </div>

                {/* Notification Area */}
                {uploadStatus && (
                    <div className={`mb-6 p-4 rounded-2xl flex items-center shadow-sm animate-slide-up ${uploadStatus === 'success' ? 'bg-green-50 border border-green-200 text-green-800' : 'bg-red-50 border border-red-200 text-red-800'}`}>
                        {uploadStatus === 'success' ? <CheckCircle className="w-5 h-5 mr-3" /> : <AlertCircle className="w-5 h-5 mr-3" />}
                        <p className="text-sm font-medium flex-1">{statusMessage}</p>
                        <button onClick={() => setUploadStatus(null)} className="ml-4 p-1 hover:bg-black/5 rounded-full">
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                )}

                {/* Content Sections */}
                {activeTab === 'knowledge' && (
                    <div className="space-y-8 animate-fade-in">
                        {/* Stats Summary */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                            {[
                                { label: 'Knowledge Base', val: `${organization?.datasets?.length || 0} Docs`, icon: FileText, color: 'blue' },
                                { label: 'Infrastructure', val: 'Active', icon: Shield, color: 'purple' },
                                { label: 'Workspace Team', val: `${organization?.users?.length || 1} Members`, icon: Users, color: 'green' }
                            ].map((stat, i) => (
                                <div key={i} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                                    <div className={`w-12 h-12 bg-${stat.color}-50 text-${stat.color}-600 rounded-2xl flex items-center justify-center mb-4 border border-${stat.color}-100`}>
                                        <stat.icon className="w-6 h-6" />
                                    </div>
                                    <p className="text-slate-500 text-sm font-medium">{stat.label}</p>
                                    <p className="text-3xl font-bold text-slate-900 mt-1">{stat.val}</p>
                                </div>
                            ))}
                        </div>

                        {/* Upload Zone */}
                        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                                <h3 className="font-bold text-slate-900">Knowledge Ingestion</h3>
                                <Activity className="w-4 h-4 text-blue-500" />
                            </div>
                            <div className="p-8 md:p-12 m-6 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50 flex flex-col items-center text-center">
                                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-all ${isUploading ? 'bg-blue-100 animate-pulse' : 'bg-white shadow-sm border border-slate-200'}`}>
                                    {isUploading ? <Loader2 className="w-8 h-8 text-blue-600 animate-spin" /> : <UploadCloud className="w-8 h-8 text-blue-600" />}
                                </div>
                                <h4 className="text-xl font-bold text-slate-900 mb-2">{isUploading ? 'Indexing Content...' : 'Upload Knowledge'}</h4>
                                <p className="text-sm text-slate-500 max-w-xs mb-8">Supports PDF and TXT files up to 10MB. Content is vectorized for AI search.</p>
                                <input type="file" ref={fileInputRef} onChange={handleFileSelect} accept=".pdf,.txt" className="hidden" id="admin-upload" />
                                <label htmlFor="admin-upload" className={`px-10 py-3.5 bg-blue-600 text-white font-bold rounded-2xl cursor-pointer hover:bg-blue-700 hover:-translate-y-0.5 transition-all shadow-lg active:scale-95 ${isUploading ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}`}>
                                    Select Files
                                </label>
                            </div>
                        </div>

                        {/* File Table */}
                        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                                <h3 className="font-bold text-slate-900">Document Repository</h3>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{organization?.datasets?.length || 0} Total</p>
                            </div>
                            {organization?.datasets?.length > 0 ? (
                                <div className="overflow-x-auto border-t border-slate-100">
                                    <table className="w-full text-left border-collapse min-w-[600px]">
                                        <thead>
                                            <tr className="bg-white text-slate-500 border-b border-slate-100">
                                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em]">Document</th>
                                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] hidden sm:table-cell">Indexed On</th>
                                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-50">
                                            {organization.datasets.map((doc) => (
                                                <tr key={doc.id} className="hover:bg-slate-50/50 transition-colors group">
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center">
                                                            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mr-4 group-hover:bg-blue-100 transition-colors">
                                                                <FileText className="w-5 h-5 transition-transform group-hover:scale-110" />
                                                            </div>
                                                            <span className="font-bold text-slate-900 truncate max-w-[150px] md:max-w-xs">{doc.filename}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-slate-500 hidden sm:table-cell font-mono">
                                                        {new Date(doc.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <button
                                                            onClick={() => handleDeleteDataset(doc.id)}
                                                            disabled={deletingId === doc.id}
                                                            className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all active:scale-90"
                                                            title="Delete document"
                                                        >
                                                            {deletingId === doc.id ? <Loader2 className="w-5 h-5 animate-spin" /> : <Trash2 className="w-5 h-5" />}
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="p-20 flex flex-col items-center justify-center text-center opacity-40">
                                    <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
                                        <Database className="w-8 h-8 text-slate-400" />
                                    </div>
                                    <p className="font-bold text-slate-900">Empty Knowledge Base</p>
                                    <p className="text-sm">Upload documents to get started</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === 'team' && (
                    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden animate-fade-in">
                        {organization?.users?.length > 0 ? (
                            <div className="overflow-x-auto border-t border-slate-100">
                                <table className="w-full text-left min-w-[600px]">
                                    <thead>
                                        <tr className="bg-slate-50/50 text-slate-500 border-b border-slate-100">
                                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em]">Team Member</th>
                                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] hidden sm:table-cell">Email</th>
                                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em]">Role</th>
                                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {organization.users.map((u) => (
                                            <tr key={u.id} className="hover:bg-slate-50/50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center">
                                                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center mr-4 text-slate-500 font-bold border-2 border-white shadow-sm ring-1 ring-slate-100 uppercase">
                                                            {u.username?.[0] || 'U'}
                                                        </div>
                                                        <span className="font-bold text-slate-900">{u.username}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-slate-500 hidden sm:table-cell font-mono">{u.email}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase border ${u.role === 'ADMIN' ? 'bg-purple-50 border-purple-200 text-purple-700' : 'bg-blue-50 border-blue-200 text-blue-700'
                                                        }`}>
                                                        {u.role}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    {u.id !== user?.id && (
                                                        <button
                                                            onClick={() => handleRemoveMember(u.id)}
                                                            disabled={deletingId === u.id}
                                                            className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all active:scale-90"
                                                            title="Remove member"
                                                        >
                                                            {deletingId === u.id ? <Loader2 className="w-5 h-5 animate-spin" /> : <Trash2 className="w-5 h-5" />}
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="p-20 flex flex-col items-center justify-center text-center opacity-40">
                                <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
                                    <Users className="w-8 h-8 text-slate-400" />
                                </div>
                                <p className="font-bold text-slate-900">No Team Members</p>
                                <p className="text-sm">Grow your workspace to collaborate</p>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'settings' && (
                    <div className="animate-fade-in space-y-6">
                        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden p-8">
                            <form onSubmit={handleUpdateSettings} className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div>
                                        <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Organization Name</label>
                                        <input
                                            type="text"
                                            value={settingsName}
                                            onChange={(e) => setSettingsName(e.target.value)}
                                            className="w-full px-5 py-3.5 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-blue-500 outline-none transition-all font-semibold"
                                        />
                                    </div>
                                    <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 flex items-center h-full">
                                        <Shield className="w-8 h-8 text-blue-500 mr-4 opacity-50" />
                                        <div>
                                            <p className="font-bold text-slate-900 text-sm">Security Policy</p>
                                            <p className="text-xs text-slate-500">Your data is logically separated and encrypted at rest.</p>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-3">AI Intelligence Profile (System Prompt)</label>
                                    <textarea
                                        rows={6}
                                        value={settingsPrompt}
                                        onChange={(e) => setSettingsPrompt(e.target.value)}
                                        className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-blue-500 outline-none transition-all font-mono text-sm leading-relaxed"
                                        placeholder="Define your agent's personality and rules..."
                                    />
                                </div>

                                <div className="flex justify-end pt-4">
                                    <button
                                        type="submit"
                                        disabled={isSavingSettings}
                                        className="px-10 py-3.5 bg-slate-900 text-white font-bold rounded-2xl hover:bg-black transition-all shadow-xl active:scale-95 disabled:opacity-50"
                                    >
                                        {isSavingSettings ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Update Workspace'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>

            {/* Invite Member Modal */}
            {isInviteModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-fade-in" onClick={() => setIsInviteModalOpen(false)} />
                    <div className="bg-white rounded-[2rem] w-full max-w-md p-6 sm:p-10 shadow-2xl relative z-10 animate-scale-in border border-slate-200">
                        <button onClick={() => setIsInviteModalOpen(false)} className="absolute top-6 right-6 sm:top-8 sm:right-8 text-slate-400 hover:text-slate-900 transition-colors">
                            <X className="w-6 h-6" />
                        </button>

                        <div className="text-center mb-10">
                            <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-[1.5rem] flex items-center justify-center mx-auto mb-6 border border-blue-100 shadow-inner">
                                <UserPlus className="w-10 h-10" />
                            </div>
                            <h2 className="text-2xl font-black text-slate-900">Invite Member</h2>
                            <p className="text-slate-500 mt-2">Grow your team workspace</p>
                        </div>

                        <form onSubmit={handleInviteUser} className="space-y-8">
                            <div>
                                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Email</label>
                                <div className="relative">
                                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                                    <input
                                        type="email"
                                        required
                                        value={inviteEmail}
                                        onChange={(e) => setInviteEmail(e.target.value)}
                                        className="w-full pl-14 pr-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-blue-500 outline-none transition-all font-semibold"
                                        placeholder="teammate@company.com"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Permissions</label>
                                <div className="bg-slate-50 p-1.5 rounded-2xl border-2 border-slate-100 grid grid-cols-2 gap-1.5">
                                    {['USER', 'ADMIN'].map((role) => (
                                        <button
                                            key={role}
                                            type="button"
                                            onClick={() => setInviteRole(role)}
                                            className={`py-3 rounded-[1rem] text-xs font-black tracking-widest transition-all ${inviteRole === role ? 'bg-white shadow-md text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
                                        >
                                            {role}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <button type="submit" disabled={isInviting} className="w-full py-4 bg-blue-600 text-white font-black rounded-2xl shadow-xl shadow-blue-200 hover:shadow-blue-300 hover:-translate-y-1 transition-all active:scale-95 disabled:opacity-50">
                                {isInviting ? <Loader2 className="w-6 h-6 animate-spin mx-auto" /> : 'Generate Access Key'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
