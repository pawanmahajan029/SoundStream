import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchSongs, deleteSong } from '../../store/musicSlice';
import { useNavigate } from 'react-router-dom';

const CreatorDashboard = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { songs, loading, error } = useSelector(state => state.music);
    const { user } = useSelector(state => state.auth);

    useEffect(() => {
        dispatch(fetchSongs());
    }, [dispatch]);

    const creatorSongs = songs.filter(song => song.user === user?._id);

    const handleDelete = (e, songId) => {
        e.stopPropagation();
        if (window.confirm("Are you sure you want to delete this track?")) {
            dispatch(deleteSong(songId));
        }
    };

    return (
        <div className="flex flex-col h-full w-full">
            <header className="w-full theme-bg-secondary border theme-border shadow-lg rounded-xl py-5 px-8 mb-8 flex items-center justify-between h-20 bg-opacity-60 backdrop-blur-md">
                <h1 className="text-2xl font-clash font-bold theme-text-primary tracking-tight">Creator Workspace</h1>
                <button
                    onClick={() => navigate('/upload-music')}
                    className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium shadow-md hover:opacity-90 transition-opacity"
                >
                    + Upload New Track
                </button>
            </header>

            <main className="flex-1 overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {loading ? (
                        <div className="col-span-full py-20 text-center theme-text-tertiary">Loading your catalog...</div>
                    ) : creatorSongs.length === 0 ? (
                        <div className="col-span-full py-20 text-center">
                            <p className="theme-text-tertiary mb-4 text-lg">You haven't uploaded any tracks yet.</p>
                            <button
                                onClick={() => navigate('/upload-music')}
                                className="text-blue-500 hover:underline"
                            >
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
            </main>
        </div>
    );
};

export default CreatorDashboard;
