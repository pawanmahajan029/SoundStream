import React from 'react';
import { NavLink } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logoutUser } from '../../store/authSlice';
import ThemeToggle from './ThemeToggle';
import InnerLogo from './InnerLogo';

const Sidebar = () => {
    const dispatch = useDispatch();
    const userRole = localStorage.getItem('userRole') || 'listener';

    const handleLogout = () => {
        dispatch(logoutUser());
    };
    return (
        <aside className="w-full h-full theme-bg-secondary border-r border-white/5 flex flex-col pt-8 pb-6 px-3 shadow-2xl z-40">
            {/* Logo Section */}
            <div className="mb-10 px-2 scale-110 origin-left">
                <InnerLogo />
            </div>

            {/* Navigation Links */}
            <nav className="flex flex-col gap-2 flex-1">
                <NavLink
                    to="/"
                    className={({ isActive }) => `w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all font-medium ${isActive ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-md' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5 dark:text-gray-400'}`}
                >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                        <polyline points="9 22 9 12 15 12 15 22" />
                    </svg>
                    Home
                </NavLink>

                <NavLink
                    to="/search"
                    className={({ isActive }) => `w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all font-medium ${isActive ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-md' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5 dark:text-gray-400'}`}
                >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="11" cy="11" r="8" />
                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                    Search
                </NavLink>

                <NavLink
                    to="/rooms"
                    className={({ isActive }) => `w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all font-medium ${isActive ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-md' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5 dark:text-gray-400'}`}
                >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                    Listen Together
                </NavLink>

                {userRole === 'creator' && (
                    <>
                        <NavLink
                            to="/creator-dashboard"
                            className={({ isActive }) => `w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all font-medium ${isActive ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-md' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5 dark:text-gray-400'}`}
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect x="3" y="3" width="7" height="7" />
                                <rect x="14" y="3" width="7" height="7" />
                                <rect x="14" y="14" width="7" height="7" />
                                <rect x="3" y="14" width="7" height="7" />
                            </svg>
                            Dashboard
                        </NavLink>
                        <NavLink
                            to="/upload-music"
                            className={({ isActive }) => `w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all font-medium ${isActive ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-md' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5 dark:text-gray-400'}`}
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                <polyline points="17 8 12 3 7 8" />
                                <line x1="12" y1="3" x2="12" y2="15" />
                            </svg>
                            Upload
                        </NavLink>
                    </>
                )}
            </nav>

            {/* Bottom Section (Theme Toggle & Logout) */}
            <div className="mt-auto border-t theme-border pt-4">
                <div className="flex items-center gap-3 px-3 py-2 text-sm text-gray-500 dark:text-gray-400 font-medium">
                    <ThemeToggle />
                    <span>Theme Switch</span>
                </div>

                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2 mt-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors font-medium cursor-pointer"
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span>Sign Out</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
