import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchLeaderboard } from '../../store/leaderboardSlice';
import { useSelector as useSel } from 'react-redux';

// Medal icons for top 3
const medals = ['🥇', '🥈', '🥉'];
const medalColors = [
    'from-yellow-400/20 to-yellow-600/10 border-yellow-500/30 text-yellow-400',
    'from-slate-400/20 to-slate-600/10 border-slate-400/30 text-slate-300',
    'from-orange-400/20 to-orange-600/10 border-orange-500/30 text-orange-400',
];

const CreatorLeaderboard = ({ creatorId }) => {
    const dispatch = useDispatch();
    const { data, loading, error } = useSelector(state => state.leaderboard);
    const topListeners = data[creatorId] || [];

    useEffect(() => {
        if (creatorId) {
            dispatch(fetchLeaderboard(creatorId));
        }
    }, [creatorId, dispatch]);

    if (loading) {
        return (
            <div className="flex justify-center py-8">
                <div className="flex space-x-1.5">
                    {[0, 1, 2].map(i => (
                        <div key={i} className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                    ))}
                </div>
            </div>
        );
    }

    if (error) return <p className="text-red-400 text-sm text-center py-4">{error}</p>;

    if (topListeners.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-8 text-center opacity-50">
                <svg className="w-10 h-10 theme-text-tertiary mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <p className="text-sm theme-text-tertiary">No plays this week yet.</p>
                <p className="text-xs theme-text-tertiary mt-1">Leaderboard updates as listeners play your songs.</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-3">
            {topListeners.map((listener, index) => (
                <div
                    key={listener.userId}
                    className={`flex items-center gap-4 p-3 rounded-xl border bg-gradient-to-r ${index < 3 ? medalColors[index] : 'border-transparent bg-white/5'} transition-all`}
                >
                    {/* Rank */}
                    <div className="text-xl w-8 text-center flex-shrink-0">
                        {index < 3 ? medals[index] : <span className="text-sm font-bold theme-text-tertiary">#{index + 1}</span>}
                    </div>

                    {/* Avatar */}
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white text-sm font-bold shadow-inner flex-shrink-0">
                        {listener.email?.[0]?.toUpperCase() || '?'}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold theme-text-primary truncate">
                            {listener.email?.split('@')[0] || 'Anonymous'}
                        </p>
                        <p className="text-xs theme-text-tertiary">{listener.email}</p>
                    </div>

                    {/* Play count badge */}
                    <div className="flex-shrink-0 flex items-center gap-1.5 bg-purple-500/10 text-purple-400 border border-purple-500/20 px-3 py-1 rounded-full text-xs font-bold">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                        </svg>
                        {listener.playCount}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default CreatorLeaderboard;
