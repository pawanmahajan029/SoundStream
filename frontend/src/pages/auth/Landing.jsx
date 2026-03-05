import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, registerUser, clearError } from '../../store/authSlice';

const Landing = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { isAuthenticated, loading, error } = useSelector((state) => state.auth);

    // Flow State: 1 (Role Selection) -> 2 (Action Choice: Login/Register) -> 3 (Form Fill)
    const [step, setStep] = useState(1);
    const [selectedRole, setSelectedRole] = useState(null); // 'listener' | 'creator'
    const [authAction, setAuthAction] = useState(null);     // 'login' | 'register'

    // Form State
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/home');
        }
    }, [isAuthenticated, navigate]);

    useEffect(() => {
        dispatch(clearError());
    }, [step, authAction, dispatch]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (authAction === 'login') {
            dispatch(loginUser({ email, password }));
        } else if (authAction === 'register') {
            dispatch(registerUser({ email, password, role: selectedRole }));
        }
    };

    const handleRoleSelect = (role) => {
        setSelectedRole(role);
        setStep(2);
    };

    const handleActionSelect = (action) => {
        setAuthAction(action);
        setStep(3);
    };

    const goBack = () => {
        if (step > 1) {
            setStep(step - 1);
            if (step === 2) setSelectedRole(null);
            if (step === 3) setAuthAction(null);
        }
    };

    return (
        <div className="landing-page min-h-screen w-full bg-[#080812] text-white flex flex-col md:flex-row font-bricolage overflow-hidden">
            {/* Left Pane - Branding & Messaging */}
            <div className="w-full md:w-5/12 lg:w-1/2 p-8 md:p-16 flex flex-col justify-between relative border-b md:border-b-0 md:border-r border-white/10 z-10 bg-[#0A0A16]">
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
                    <div className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] rounded-full bg-blue-600/20 blur-[120px]"></div>
                    <div className="absolute top-[60%] -right-[20%] w-[60%] h-[60%] rounded-full bg-purple-600/20 blur-[120px]"></div>
                </div>

                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-16 px-1">
                        <svg width="32" height="32" viewBox="0 0 40 40" fill="none">
                            <rect width="40" height="40" rx="12" fill="white" fillOpacity="0.05" />
                            <circle cx="20" cy="20" r="10" stroke="#8b5cf6" strokeWidth="3" opacity="0.8" />
                            <path d="M18 25V15L25 13V22" stroke="#e2e8f0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <circle cx="17" cy="25" r="2" fill="#e2e8f0" />
                            <circle cx="24" cy="23" r="2" fill="#e2e8f0" />
                        </svg>
                        <span className="text-xl font-bold tracking-tight text-gray-100 font-clash">SoundStream</span>
                    </div>

                    <div className="max-w-md">
                        <span className="uppercase tracking-[3px] text-xs font-semibold text-blue-400 mb-4 block">The Professional Choice</span>
                        <h1 className="text-5xl md:text-6xl font-bold leading-[1.05] tracking-tight mb-6 font-clash text-white">
                            Master Your <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                                Audio Space.
                            </span>
                        </h1>
                        <p className="text-gray-400 text-lg leading-relaxed font-light">
                            A highly optimized workspace for creators and audiophiles. High-fidelity streaming, precise management, and seamless collaboration.
                        </p>
                    </div>
                </div>

                <div className="mt-16 md:mt-0 relative z-10">
                    <p className="text-sm tracking-wide text-gray-500">© 2026 SoundStream. Built for professionals.</p>
                </div>
            </div>

            {/* Right Pane - Strict 3-Step Gateway */}
            <div className="w-full md:w-7/12 lg:w-1/2 p-8 md:p-16 flex flex-col justify-center bg-[#05050A]">
                <div className="max-w-md w-full mx-auto relative">

                    {/* BACK BUTTON */}
                    {step > 1 && (
                        <button
                            onClick={goBack}
                            className="absolute -top-12 left-0 text-sm text-gray-400 hover:text-white flex items-center transition-colors"
                        >
                            ← Back
                        </button>
                    )}

                    {/* STEP 1: SELECT WORKSPACE ROLE */}
                    {step === 1 && (
                        <div className="animate-fade-in">
                            <div className="mb-10">
                                <h2 className="text-3xl font-semibold text-gray-100 mb-3 font-clash">Select Workspace</h2>
                                <p className="text-gray-400">Choose your environment profile to continue.</p>
                            </div>

                            <div className="flex flex-col gap-4">
                                <button
                                    onClick={() => handleRoleSelect('listener')}
                                    className="group relative w-full flex items-center p-6 rounded-2xl border text-left transition-all duration-300 bg-transparent border-white/5 hover:border-blue-500/50 hover:bg-white-[0.02]"
                                >
                                    <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 mr-5 transition-transform border border-blue-500/20 group-hover:scale-105">
                                        <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                                        </svg>
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-lg font-medium text-gray-100 mb-1">Audiophile</h3>
                                        <p className="text-sm text-gray-500">High-fidelity streaming and curation.</p>
                                    </div>
                                </button>

                                <button
                                    onClick={() => handleRoleSelect('creator')}
                                    className="group relative w-full flex items-center p-6 rounded-2xl border text-left transition-all duration-300 bg-transparent border-white/5 hover:border-purple-500/50 hover:bg-white-[0.02]"
                                >
                                    <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 mr-5 transition-transform border border-purple-500/20 group-hover:scale-105">
                                        <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                                        </svg>
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-lg font-medium text-gray-100 mb-1">Creator</h3>
                                        <p className="text-sm text-gray-500">Upload, manage, and monetize catalog.</p>
                                    </div>
                                </button>
                            </div>
                        </div>
                    )}

                    {/* STEP 2: CHOOSE ACTION (LOGIN OR REGISTER) */}
                    {step === 2 && (
                        <div className="animate-fade-in">
                            <div className="mb-10">
                                <span className="uppercase tracking-widest text-xs font-semibold text-gray-500 mb-2 block">
                                    {selectedRole === 'creator' ? 'CREATOR WORKSPACE' : 'LISTENER WORKSPACE'}
                                </span>
                                <h2 className="text-3xl font-semibold text-gray-100 mb-3 font-clash">Welcome</h2>
                                <p className="text-gray-400">Do you already have an account?</p>
                            </div>

                            <div className="flex flex-col gap-4">
                                <button
                                    onClick={() => handleActionSelect('login')}
                                    className={`w-full py-4 rounded-xl border font-semibold tracking-wide transition-all ${selectedRole === 'creator'
                                        ? 'bg-purple-600 hover:bg-purple-500 border-purple-500 text-white shadow-[0_0_20px_rgba(168,85,247,0.2)]'
                                        : 'bg-blue-600 hover:bg-blue-500 border-blue-500 text-white shadow-[0_0_20px_rgba(59,130,246,0.2)]'
                                        }`}
                                >
                                    Yes, Log into my Account
                                </button>

                                <button
                                    onClick={() => handleActionSelect('register')}
                                    className="w-full py-4 rounded-xl border border-white/10 bg-transparent hover:bg-white/5 text-gray-300 font-semibold tracking-wide transition-all"
                                >
                                    No, Create a New Account
                                </button>
                            </div>
                        </div>
                    )}

                    {/* STEP 3: FILL DETAILS */}
                    {step === 3 && (
                        <div className="animate-fade-in">
                            <div className="mb-10">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className={`w-2 h-2 rounded-full ${selectedRole === 'creator' ? 'bg-purple-500' : 'bg-blue-500'}`}></span>
                                    <span className="uppercase tracking-widest text-xs font-semibold text-gray-500">
                                        {selectedRole === 'creator' ? 'CREATOR ' : 'LISTENER '}
                                        {authAction === 'login' ? 'SIGN IN' : 'REGISTRATION'}
                                    </span>
                                </div>
                                <h2 className="text-3xl font-semibold text-gray-100 mb-2 font-clash">
                                    {authAction === 'login' ? 'Welcome Back.' : 'Join the Network.'}
                                </h2>
                                <p className="text-gray-400 text-sm">
                                    {authAction === 'login'
                                        ? 'Enter your credentials to access your audio space.'
                                        : `Provide your email and password to secure your ${selectedRole} profile.`}
                                </p>
                            </div>

                            {error && (
                                <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                                <div>
                                    <label className="block text-xs font-semibold tracking-wider text-gray-500 uppercase mb-2">Email Address</label>
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className={`w-full bg-[#0A0A16] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:ring-1 transition-all ${selectedRole === 'creator' ? 'focus:border-purple-500/50 focus:ring-purple-500/50' : 'focus:border-blue-500/50 focus:ring-blue-500/50'
                                            }`}
                                        placeholder="you@example.com"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold tracking-wider text-gray-500 uppercase mb-2">Password</label>
                                    <input
                                        type="password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className={`w-full bg-[#0A0A16] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:ring-1 transition-all ${selectedRole === 'creator' ? 'focus:border-purple-500/50 focus:ring-purple-500/50' : 'focus:border-blue-500/50 focus:ring-blue-500/50'
                                            }`}
                                        placeholder="••••••••"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={`mt-4 w-full text-white font-semibold py-3.5 rounded-xl transition-all flex items-center justify-center disabled:opacity-70 disabled:active:scale-100 ${selectedRole === 'creator'
                                        ? 'bg-purple-600 hover:bg-purple-500 active:scale-[0.98]'
                                        : 'bg-blue-600 hover:bg-blue-500 active:scale-[0.98]'
                                        }`}
                                >
                                    {loading ? (
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    ) : (
                                        authAction === 'login' ? 'Sign In to Workspace' : 'Create Sandbox Account'
                                    )}
                                </button>
                            </form>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default Landing;
