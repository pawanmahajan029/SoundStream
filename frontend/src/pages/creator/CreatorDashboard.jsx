import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchSongs, deleteSong } from '../../store/musicSlice';
import { fetchCollabInbox, respondToRequest } from '../../store/collabSlice';
import { useNavigate } from 'react-router-dom';
import CreatorLeaderboard from '../../components/creator/CreatorLeaderboard';

const statusColors = {
    pending: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
    accepted: 'bg-green-500/10 text-green-400 border-green-500/30',
    rejected: 'bg-red-500/10 text-red-400 border-red-500/30',
};

const CreatorDashboard = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { songs, loading } = useSelector(state => state.music);
    const { user } = useSelector(state => state.auth);
    const { inbox, loading: collabLoading } = useSelector(state => state.collab);

    const [activeTab, setActiveTab] = useState('tracks'); // 'tracks' | 'collab' | 'leaderboard'

    useEffect(() => {
        dispatch(fetchSongs());
    }, [dispatch]);

    useEffect(() => {
        if (activeTab === 'collab') {
            dispatch(fetchCollabInbox());
        }
    }, [activeTab, dispatch]);

    const creatorSongs = songs.filter(song => song.user === user?._id);

    const handleDelete = (e, songId) => {
        e.stopPropagation();
        if (window.confirm("Are you sure you want to delete this track?")) {
            dispatch(deleteSong(songId));
        }
    };

    const handleRespond = (requestId, status) => {
        dispatch(respondToRequest({ requestId, status }));
    };

    const tabs = [
        { key: 'tracks', label: 'My Tracks', emoji: '🎵' },
        { key: 'collab', label: 'Collab Inbox', emoji: '🎸' },
        { key: 'leaderboard', label: 'Top Listeners', emoji: '🏆' },
    ];

    return (
        <div className="flex flex-col h-full w-full">
            {/* Header */}
            <header className="w-full theme-bg-secondary border theme-border shadow-lg rounded-xl py-5 px-8 mb-6 flex items-center justify-between h-20 bg-opacity-60 backdrop-blur-md">
                <h1 className="text-2xl font-clash font-bold theme-text-primary tracking-tight">Creator Workspace</h1>
                <button
                    onClick={() => navigate('/upload-music')}
                    className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium shadow-md hover:opacity-90 transition-opacity"
                >
                    + Upload New Track
                </button>
            </header>

            {/* Tabs */}
            <div className="flex gap-1 p-1 theme-bg-secondary border theme-border rounded-xl mb-6 w-fit">
                {tabs.map(tab => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === tab.key
                                ? 'bg-purple-500 text-white shadow-md'
                                : 'theme-text-tertiary hover:theme-text-primary hover:bg-white/5'
                            }`}
                    >
                        <span>{tab.emoji}</span>
                        {tab.label}
                        {tab.key === 'collab' && inbox.filter(r => r.status === 'pending').length > 0 && (
                            <span className="bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                                {inbox.filter(r => r.status === 'pending').length}
                            </span>
                        )}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <main className="flex-1 overflow-y-auto">

                {/* === MY TRACKS TAB === */}
                {activeTab === 'tracks' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {loading ? (
                            <div className="col-span-full py-20 text-center theme-text-tertiary">Loading your catalog...</div>
                        ) : creatorSongs.length === 0 ? (
                            <div className="col-span-full py-20 text-center">
                                <p className="theme-text-tertiary mb-4 text-lg">You haven't uploaded any tracks yet.</p>
                                <button onClick={() => navigate('/upload-music')} className="text-blue-500 hover:underline">
                                    Start by uploading your first song
                                </button>
                            </div>
                        ) : (
                            creatorSongs.map(song => (
                                <div key={song._id} className="theme-bg-secondary border theme-border rounded-xl overflow-hidden hover:scale-[1.02] transition-transform duration-300 group shadow-sm">
                                    <div className="relative aspect-square overflow-hidden">
                                        <img src={song.poster} alt={song.title} className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                                            <button
                                                onClick={(e) => handleDelete(e, song._id)}
                                                className="p-3 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
                                                title="Delete track"
                                            >
                                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                    <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <h3 className="font-semibold theme-text-primary truncate">{song.title}</h3>
                                        <p className="text-sm theme-text-tertiary">{song.artist}</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}

                {/* === COLLAB INBOX TAB === */}
                {activeTab === 'collab' && (
                    <div className="max-w-2xl">
                        {collabLoading ? (
                            <div className="flex justify-center py-12">
                                <div className="flex space-x-1.5">
                                    {[0, 1, 2].map(i => (
                                        <div key={i} className="w-2.5 h-2.5 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                                    ))}
                                </div>
                            </div>
                        ) : inbox.length === 0 ? (
                            <div className="theme-bg-secondary border theme-border rounded-2xl p-12 text-center opacity-60">
                                <div className="text-4xl mb-3">🎸</div>
                                <p className="theme-text-tertiary font-medium">No collab requests yet.</p>
                                <p className="text-sm theme-text-tertiary mt-1">When listeners want to collaborate, they'll appear here.</p>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-4">
                                {inbox.map(req => (
                                    <div key={req._id} className="theme-bg-secondary border theme-border rounded-2xl p-5 flex flex-col gap-4">
                                        {/* Song & Sender Row */}
                                        <div className="flex items-start gap-4">
                                            {req.song?.poster && (
                                                <img src={req.song.poster} alt={req.song.title} className="w-14 h-14 rounded-xl object-cover flex-shrink-0 shadow" />
                                            )}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <p className="font-semibold theme-text-primary text-sm truncate">
                                                        {req.from?.email?.split('@')[0] || 'Listener'}
                                                    </p>
                                                    <span className="text-xs theme-text-tertiary">→ on</span>
                                                    <p className="text-sm font-medium text-purple-400 truncate">{req.song?.title || 'Unknown Song'}</p>
                                                </div>
                                                <p className="text-xs theme-text-tertiary mt-0.5">{req.from?.email}</p>
                                            </div>
                                            {/* Status Badge */}
                                            <span className={`flex-shrink-0 text-[10px] uppercase tracking-wider font-bold px-2.5 py-1 rounded-full border ${statusColors[req.status]}`}>
                                                {req.status}
                                            </span>
                                        </div>

                                        {/* Message */}
                                        <p className="text-sm theme-text-secondary bg-white/5 rounded-xl px-4 py-3 border theme-border leading-relaxed">
                                            "{req.message}"
                                        </p>

                                        {/* Actions — only for pending */}
                                        {req.status === 'pending' && (
                                            <div className="flex gap-3">
                                                <button
                                                    onClick={() => handleRespond(req._id, 'accepted')}
                                                    className="flex-1 py-2 rounded-xl text-sm font-semibold bg-green-500/10 text-green-400 border border-green-500/30 hover:bg-green-500/20 transition-colors"
                                                >
                                                    ✓ Accept
                                                </button>
                                                <button
                                                    onClick={() => handleRespond(req._id, 'rejected')}
                                                    className="flex-1 py-2 rounded-xl text-sm font-semibold bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20 transition-colors"
                                                >
                                                    ✕ Decline
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* === TOP LISTENERS TAB === */}
                {activeTab === 'leaderboard' && (
                    <div className="max-w-2xl">
                        <div className="theme-bg-secondary border theme-border rounded-2xl p-6">
                            <div className="flex items-center gap-3 mb-6">
                                <span className="text-2xl">🏆</span>
                                <div>
                                    <h2 className="font-bold theme-text-primary">Your Top Listeners</h2>
                                    <p className="text-xs theme-text-tertiary">Who played your music most this week</p>
                                </div>
                            </div>
                            {user?._id ? (
                                <CreatorLeaderboard creatorId={user._id} />
                            ) : (
                                <p className="text-sm theme-text-tertiary text-center py-8">Loading creator info...</p>
                            )}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default CreatorDashboard;
