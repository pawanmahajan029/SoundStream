import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { sendCollabRequest, clearCollabMessages } from '../../store/collabSlice';

const CollabRequestModal = ({ song, creatorId, onClose }) => {
    const dispatch = useDispatch();
    const { sendLoading, successMessage, error } = useSelector(state => state.collab);
    const [message, setMessage] = useState('');

    // Auto-close on success after a short delay
    useEffect(() => {
        if (successMessage) {
            const timer = setTimeout(() => {
                dispatch(clearCollabMessages());
                onClose();
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [successMessage, dispatch, onClose]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!message.trim()) return;
        dispatch(sendCollabRequest({ toCreatorId: creatorId, songId: song._id, message }));
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div className="theme-bg-secondary border theme-border rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6 flex flex-col gap-5 animate-fadeIn">

                {/* Header */}
                <div className="flex items-start justify-between">
                    <div>
                        <h2 className="text-lg font-bold theme-text-primary">Request Collaboration</h2>
                        <p className="text-xs theme-text-tertiary mt-0.5">Send a message to the creator of this song</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-lg hover:bg-white/10 transition-colors theme-text-tertiary"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Song Preview */}
                <div className="flex items-center gap-3 p-3 rounded-xl bg-purple-500/10 border border-purple-500/20">
                    <img
                        src={song.poster}
                        alt={song.title}
                        className="w-12 h-12 rounded-lg object-cover shadow"
                    />
                    <div>
                        <p className="font-semibold theme-text-primary text-sm">{song.title}</p>
                        <p className="text-xs theme-text-tertiary">{song.artist}</p>
                    </div>
                </div>

                {/* Message Form */}
                {successMessage ? (
                    <div className="flex flex-col items-center justify-center py-4 gap-2">
                        <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
                            <svg className="w-6 h-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <p className="text-green-400 font-medium text-sm">{successMessage}</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <div>
                            <label className="block text-xs font-medium theme-text-secondary mb-2">
                                Your message to the creator
                            </label>
                            <textarea
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="e.g. Hey! I love this track. I'm a vocalist and would love to collaborate on something similar..."
                                className="w-full theme-bg-secondary border theme-border rounded-xl px-4 py-3 text-sm theme-text-primary focus:outline-none focus:border-purple-500 transition-colors resize-none"
                                rows={4}
                                maxLength={500}
                            />
                            <p className="text-right text-xs theme-text-tertiary mt-1">{message.length}/500</p>
                        </div>

                        {error && (
                            <p className="text-red-400 text-xs bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{error}</p>
                        )}

                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium theme-text-tertiary border theme-border hover:bg-white/5 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={!message.trim() || sendLoading}
                                className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold bg-purple-500 hover:bg-purple-600 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {sendLoading ? (
                                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z" />
                                    </svg>
                                ) : (
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                    </svg>
                                )}
                                {sendLoading ? 'Sending...' : 'Send Request'}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default CollabRequestModal;
