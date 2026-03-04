import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext();

export const useSocket = () => {
    return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const [roomId, setRoomId] = useState(null);
    const [participants, setParticipants] = useState([]);
    const [chatMessages, setChatMessages] = useState([]);

    useEffect(() => {
        // Initialize socket connection to backend
        // In dev, use localhost:3000 where backend runs. In prod, standard window location.
        const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

        const newSocket = io(backendUrl, {
            withCredentials: true,
        });

        setSocket(newSocket);

        newSocket.on('connect', () => {
            console.log('Connected to WebSocket server:', newSocket.id);
        });

        // Setup global room listeners
        newSocket.on('user-joined', (userId, allParticipants) => {
            console.log(`User ${userId} joined room`);
            setParticipants(allParticipants);
        });

        newSocket.on('room-participants', (allParticipants) => {
            setParticipants(allParticipants);
        });

        newSocket.on('user-left', (userId, allParticipants) => {
            console.log(`User ${userId} left room`);
            setParticipants(allParticipants);
        });

        newSocket.on('chat-message', (message, sender, senderId) => {
            setChatMessages((prev) => [...prev, { message, sender, senderId }]);
        });

        return () => {
            newSocket.close();
        };
    }, []);

    const joinRoom = (newRoomId) => {
        if (socket) {
            socket.emit('join-room', newRoomId);
            setRoomId(newRoomId);
            // reset chat
            setChatMessages([]);
            console.log(`Joining Room: ${newRoomId}`);
        }
    };

    const leaveRoom = () => {
        if (socket && roomId) {
            // Disconnecting entirely is handled automatically on close, 
            // but we can manually manage state leaving
            setRoomId(null);
            setParticipants([]);
        }
    }

    const value = {
        socket,
        roomId,
        participants,
        chatMessages,
        setChatMessages,
        joinRoom,
        leaveRoom
    };

    return (
        <SocketContext.Provider value={value}>
            {children}
        </SocketContext.Provider>
    );
};
