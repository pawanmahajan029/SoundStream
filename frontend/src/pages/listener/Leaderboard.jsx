import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchLeaderboard } from '../../store/leaderboardSlice';

const medals = ['🥇', '🥈', '🥉'];
const medalGradients = [
    'from-yellow-400/20 to-yellow-600/5 border-yellow-500/30',
    'from-slate-300/20 to-slate-500/5 border-slate-400/30',
    'from-orange-400/20 to-orange-600/5 border-orange-500/30',
];

const Leaderboard = () => {
    const dispatch = useDispatch();
    const { songs } = useSelector(state => state.music);
    const { data, loading, error } = useSelector(state => state.leaderboard);

    // Build unique creator list from songs
    const creators = [...new Map(
        songs
            .filter(s => s.user)
            .map(s => [s.user, { id: s.user, name: s.artist }])
    ).values()];

    const [selectedCreatorId, setSelectedCreatorId] = useState('');
    const topListeners = selectedCreatorId ? (data[selectedCreatorId] || []) : [];

    useEffect(() => {
        if (creators.length > 0 && !selectedCreatorId) {
            setSelectedCreatorId(creators[0].id);
        }
    }, [creators.length]);

    useEffect(() => {
        if (selectedCreatorId) {
            dispatch(fetchLeaderboard(selectedCreatorId));
        }
    }, [selectedCreatorId, dispatch]);

    return (
        <div className="flex flex-col h-full w-full">
            {/* Header */}
            <header className="w-full theme-bg-secondary border theme-border shadow-[0_8px_30px_rgb(0,0,0,0.12)] rounded-xl py-5 px-8 mb-8 flex items-center justify-between h-20 bg-opacity-60 backdrop-blur-md">
                <div>
                    <h1 className="text-2xl font-clash font-bold theme-text-primary tracking-tight">Top Listener Leaderboard</h1>
                    <p className="text-xs theme-text-tertiary mt-0.5">Top 5 fans per creator · Updated weekly</p>
                </div>
                <div className="flex items-center gap-2 text-2xl">🏆</div>
            </header>

            <main className="flex-1 max-w-2xl mx-auto w-full">
                {/* Creator Selector */}
                <div className="mb-6">
                    <label className="block text-xs font-medium theme-text-secondary mb-2 uppercase tracking-wider">
                        Select Creator
                    </label>
                    {creators.length === 0 ? (
                        <p className="text-sm theme-text-tertiary">No songs found. Play some songs to see creators.</p>
                    ) : (
                        <div className="flex flex-wrap gap-2">
                            {creators.map(creator => (
                                <button
                                    key={creator.id}
                                    onClick={() => setSelectedCreatorId(creator.id)}
                                    className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${selectedCreatorId === creator.id
                                            ? 'bg-purple-500 border-purple-500 text-white shadow-md'
                                            : 'theme-bg-secondary theme-border theme-text-tertiary hover:border-purple-500/50'
                                        }`}
                                >
                                    {creator.name}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Leaderboard Card */}
                <div className="theme-bg-secondary border theme-border rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] p-6">
                    <h2 className="text-base font-bold theme-text-primary mb-1">
                        {creators.find(c => c.id === selectedCreatorId)?.name || '—'}
                    </h2>
                    <p className="text-xs theme-text-tertiary mb-6">Listeners ranked by total plays this week</p>

                    {loading ? (
                        <div className="flex justify-center py-12">
                            <div className="flex space-x-1.5">
                                {[0, 1, 2].map(i => (
                                    <div key={i} className="w-2.5 h-2.5 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                                ))}
                            </div>
                        </div>
                    ) : error ? (
                        <p className="text-red-400 text-sm text-center py-8">{error}</p>
                    ) : topListeners.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center opacity-60">
                            <svg className="w-12 h-12 theme-text-tertiary mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                            <p className="theme-text-tertiary text-sm font-medium">No plays recorded this week yet</p>
                            <p className="theme-text-tertiary text-xs mt-1">Start playing songs to appear on the leaderboard!</p>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-3">
                            {topListeners.map((listener, index) => (
                                <div
                                    key={listener.userId}
                                    className={`flex items-center gap-4 p-4 rounded-xl border bg-gradient-to-r transition-all hover:scale-[1.01] ${index < 3
                                            ? medalGradients[index]
                                            : 'border-transparent bg-white/5'
                                        }`}
                                >
                                    {/* Rank / Medal */}
                                    <div className="w-8 text-center flex-shrink-0 text-xl">
                                        {index < 3
                                            ? medals[index]
                                            : <span className="text-sm font-bold theme-text-tertiary">#{index + 1}</span>
                                        }
                                    </div>

                                    {/* Avatar */}
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold text-sm shadow flex-shrink-0">
                                        {listener.email?.[0]?.toUpperCase() || '?'}
                                    </div>

                                    {/* Name & Email */}
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold theme-text-primary text-sm truncate">
                                            {listener.email?.split('@')[0] || 'Anonymous'}
                                        </p>
                                        <p className="text-xs theme-text-tertiary truncate">{listener.email}</p>
                                    </div>

                                    {/* Play Count */}
                                    <div className="flex-shrink-0 flex items-center gap-1.5 bg-purple-500/15 text-purple-400 border border-purple-500/25 px-3 py-1.5 rounded-full text-xs font-bold">
                                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M8 5v14l11-7z" />
                                        </svg>
                                        {listener.playCount} {listener.playCount === 1 ? 'play' : 'plays'}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default Leaderboard;
