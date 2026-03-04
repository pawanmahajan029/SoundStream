import React from 'react';
import Sidebar from './Sidebar';
import BottomPlayer from './BottomPlayer';

const Layout = ({ children }) => {
    return (
        <div className="grid grid-cols-[260px_1fr] grid-rows-[1fr_90px] h-screen w-full overflow-hidden theme-bg-primary">
            {/* Left Column: Sidebar */}
            <div className="col-start-1 col-end-2 row-start-1 row-end-3">
                <Sidebar />
            </div>

            {/* Right Column: Main Content Area */}
            <div className="col-start-2 col-end-3 row-start-1 row-end-2 overflow-y-auto w-full h-full relative p-6 lg:p-10">
                {children}
            </div>

            {/* Bottom Row: Global Player spanning the layout beside Sidebar */}
            <div className="col-start-2 col-end-3 row-start-2 row-end-3 relative z-50">
                <BottomPlayer />
            </div>
        </div>
    );
};

export default Layout;
