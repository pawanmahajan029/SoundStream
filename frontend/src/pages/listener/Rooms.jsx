import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setCurrentSong, togglePlayPause } from '../../store/musicSlice';
import { useSocket } from '../../context/SocketContext';

const Rooms = () => {
    const dispatch = useDispatch()
    const { isPlaying } = useSelector(state => state.music)
    const { roomId, joinRoom, leaveRoom, participants, chatMessages, setChatMessages, socket } = useSocket();
    const [joinInput, setJoinInput] = useState('');
    const [chatInput, setChatInput] = useState('');

    const handleCreateRoom = () => {
        // Generate random 6-character room code
        const newRoom = Math.random().toString(36).substring(2, 8).toUpperCase();
        joinRoom(newRoom);
    };

    const handleJoinRoom = () => {
        if (joinInput.trim().length > 0) {
            joinRoom(joinInput.trim().toUpperCase());
        }
    };

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (chatInput.trim().length > 0 && socket && roomId) {
            const msgText = chatInput.trim();
            const senderName = `User ${socket.id.substring(0, 4)}`;
            socket.emit("chat-message", roomId, msgText, senderName);
            setChatMessages(prev => [...prev, { message: msgText, sender: senderName, senderId: socket.id }]);
            setChatInput('');
        }
    };

    return (
        <div className="flex flex-col h-full w-full">
            {/* Top Title Header */}
            <header className="w-full theme-bg-secondary border theme-border shadow-[0_8px_30px_rgb(0,0,0,0.12)] rounded-xl py-5 px-8 mb-8 flex items-center h-20 bg-opacity-60 backdrop-blur-md">
                <h1 className="text-2xl font-clash font-bold theme-text-primary tracking-tight">Live Listening Rooms</h1>
            </header>

            <main className="flex-1 pb-16">
                {!roomId ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
                        {/* Create Room Card */}
                        <div className="theme-bg-secondary rounded-xl p-8 border theme-border shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.2)] transition-shadow">
                            <div className="flex items-center gap-3 mb-4">
                                <svg className="w-6 h-6 text-purple-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M3 18v-6a9 9 0 0 1 18 0v6"></path>
                                    <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path>
                                </svg>
                                <h2 className="text-xl font-bold text-purple-500">Create a Room</h2>
                            </div>
                            <p className="theme-text-tertiary mb-8 text-sm">
                                Start a new synchronized listening session with friends.
                            </p>
                            <button
                                onClick={handleCreateRoom}
                                className="px-5 py-2.5 bg-purple-500 hover:bg-purple-600 text-white text-sm font-medium rounded-lg transition-colors shadow-sm cursor-pointer"
                            >
                                Create New Room
                            </button>
                        </div>

                        {/* Join Room Card */}
                        <div className="theme-bg-secondary rounded-xl p-8 border theme-border shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.2)] transition-shadow">
                            <div className="flex items-center gap-3 mb-4">
                                <svg className="w-6 h-6 text-purple-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
                                    <polyline points="10 17 15 12 10 7"></polyline>
                                    <line x1="15" y1="12" x2="3" y2="12"></line>
                                </svg>
                                <h2 className="text-xl font-bold text-purple-500">Join a Room</h2>
                            </div>
                            <p className="theme-text-tertiary mb-6 text-sm">
                                Have a Room ID? Enter it below to join the session.
                            </p>

                            <div className="flex flex-col gap-4">
                                <input
                                    type="text"
                                    value={joinInput}
                                    onChange={(e) => setJoinInput(e.target.value)}
                                    placeholder="Enter Room ID"
                                    className="w-full theme-bg-secondary theme-border border rounded-lg px-4 py-2.5 text-sm theme-text-primary focus:outline-none focus:border-purple-500 transition-colors"
                                    autoComplete="off"
                                />
                                <button
                                    onClick={handleJoinRoom}
                                    className="px-5 py-2.5 w-max bg-purple-500 hover:bg-purple-600 text-white text-sm font-medium rounded-lg transition-colors shadow-sm cursor-pointer"
                                >
                                    Join Room
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col lg:flex-row gap-6 max-w-6xl mx-auto h-[600px]">
                        {/* Participants Panel */}
                        <div className="w-full lg:w-1/3 flex flex-col gap-4">
                            <div className="theme-bg-secondary rounded-xl p-6 border theme-border shadow-[0_8px_30px_rgb(0,0,0,0.12)] flex flex-col gap-2">
                                <div className="flex items-center justify-between mb-2">
                                    <h2 className="text-lg font-bold theme-text-primary">Room Info</h2>
                                    <button onClick={leaveRoom} className="text-red-400 hover:text-red-500 text-sm font-medium cursor-pointer">Leave</button>
                                </div>
                                <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg text-center">
                                    <span className="text-xs theme-text-tertiary uppercase tracking-wider block mb-1">Room ID</span>
                                    <span className="text-2xl font-mono font-bold text-purple-500">{roomId}</span>
                                </div>
                            </div>

                            <div className="theme-bg-secondary rounded-xl p-6 border theme-border shadow-[0_8px_30px_rgb(0,0,0,0.12)] flex-1 overflow-y-auto">
                                <h3 className="text-md font-bold theme-text-primary mb-4 flex items-center justify-between">
                                    Participants
                                    <span className="bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 text-xs px-2 py-1 rounded-full">{participants.length}</span>
                                </h3>
                                <ul className="flex flex-col gap-3">
                                    {participants.map((id, index) => (
                                        <li key={index} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-blue-500 flex items-center justify-center text-white text-xs font-bold shadow-inner">
                                                {id.substring(0, 2).toUpperCase()}
                                            </div>
                                            <span className="text-sm theme-text-secondary font-medium truncate">
                                                {id === socket?.id ? "You" : `User ${id.substring(0, 4)}`}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* Chat Panel */}
                        <div className="w-full lg:w-2/3 theme-bg-secondary rounded-xl border theme-border shadow-[0_8px_30px_rgb(0,0,0,0.12)] flex flex-col overflow-hidden">
                            <div className="p-4 border-b theme-border bg-gray-50/50 dark:bg-gray-800/50">
                                <h3 className="font-bold theme-text-primary flex items-center gap-2">
                                    <svg className="w-5 h-5 text-purple-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                                    </svg>
                                    Room Chat
                                </h3>
                            </div>

                            <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-4">
                                {chatMessages.length === 0 ? (
                                    <div className="h-full flex flex-col items-center justify-center text-center opacity-50">
                                        <svg className="w-12 h-12 text-gray-400 mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                                        </svg>
                                        <p className="theme-text-tertiary text-sm">No messages yet. Say hello!</p>
                                    </div>
                                ) : (
                                    chatMessages.map((msg, index) => {
                                        const isMe = msg.senderId === socket?.id;
                                        return (
                                            <div key={index} className={`flex flex-col max-w-[80%] ${isMe ? 'self-end items-end' : 'self-start items-start'}`}>
                                                <span className="text-[10px] theme-text-tertiary mb-1 px-1">{msg.sender}</span>
                                                <div className={`px-4 py-2 rounded-2xl text-sm ${isMe ? 'bg-purple-500 text-white rounded-tr-sm shadow-sm' : 'bg-gray-100 dark:bg-gray-800 theme-text-secondary rounded-tl-sm shadow-sm border theme-border'}`}>
                                                    {msg.message}
                                                </div>
                                            </div>
                                        )
                                    })
                                )}
                            </div>

                            <form onSubmit={handleSendMessage} className="p-4 border-t theme-border bg-gray-50/50 dark:bg-gray-800/50 flex gap-3">
                                <input
                                    type="text"
                                    value={chatInput}
                                    onChange={(e) => setChatInput(e.target.value)}
                                    placeholder="Type a message..."
                                    className="flex-1 theme-bg-secondary theme-border border rounded-full px-4 text-sm theme-text-primary focus:outline-none focus:border-purple-500 shadow-inner"
                                />
                                <button type="submit" disabled={!chatInput.trim()} className="p-2.5 bg-purple-500 hover:bg-purple-600 disabled:bg-gray-300 dark:disabled:bg-gray-700 text-white rounded-full transition-colors cursor-pointer disabled:cursor-not-allowed shadow-sm">
                                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <line x1="22" y1="2" x2="11" y2="13"></line>
                                        <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                                    </svg>
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default Rooms;
