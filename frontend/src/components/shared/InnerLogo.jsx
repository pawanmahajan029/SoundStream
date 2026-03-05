import React from 'react';
import { NavLink } from 'react-router-dom';

const InnerLogo = () => {
    return (
        <NavLink to="/" className="flex items-center gap-3">
            <svg className="w-8 h-8 text-indigo-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18V5l12-2v13"></path>
                <circle cx="6" cy="18" r="3"></circle>
                <circle cx="18" cy="16" r="3"></circle>
            </svg>
            <span className="text-[26px] font-extrabold bg-gradient-to-r from-indigo-500 to-blue-400 bg-clip-text text-transparent transform md:-mt-1 tracking-tight">SoundStream</span>
        </NavLink>
    );
};

export default InnerLogo;
