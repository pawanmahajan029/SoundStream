import { Server } from "socket.io";

let connections = {}; // { roomId: [socketId1, socketId2, ...] }
let timeOnline = {}; // { socketId: Date }

export const connectToSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: [
                "http://localhost:5173",
                "http://localhost:5174",
                "http://localhost:4173",
                "http://127.0.0.1:5173",
                "http://localhost:4000"
            ],
            methods: ["GET", "POST"],
            credentials: true
        }
    });

    io.on("connection", (socket) => {
        console.log("Socket Connected:", socket.id);

        socket.on("join-room", (roomId) => {
            if (connections[roomId] === undefined) {
                connections[roomId] = [];
            }

            // Prevent duplicate connections if they rejoin
            if (!connections[roomId].includes(socket.id)) {
                connections[roomId].push(socket.id);
            }

            timeOnline[socket.id] = new Date();
            socket.join(roomId);

            // Notify others in room
            socket.to(roomId).emit("user-joined", socket.id, connections[roomId]);

            // Send current participant list back to the joiner
            io.to(socket.id).emit("room-participants", connections[roomId]);
        });

        // Sync Music Playback state (Play, Pause, Seek, Next Track)
        socket.on("sync-playback", (roomId, actionData) => {
            // Broadcast the playback action to everyone else in the room
            socket.to(roomId).emit("sync-playback", actionData);
        });

        socket.on("chat-message", (roomId, data, sender) => {
            // Broadcast chat to everyone else in the room
            socket.to(roomId).emit("chat-message", data, sender, socket.id);
        });

        socket.on("disconnect", () => {
            console.log("Socket Disconnected:", socket.id);
            // Clean up connections
            for (const [roomId, users] of Object.entries(connections)) {
                if (users.includes(socket.id)) {
                    // Remove user from room array
                    connections[roomId] = users.filter(id => id !== socket.id);

                    // Notify room
                    socket.to(roomId).emit("user-left", socket.id, connections[roomId]);

                    // Cleanup empty rooms
                    if (connections[roomId].length === 0) {
                        delete connections[roomId];
                    }
                }
            }
            delete timeOnline[socket.id];
        });
    });

    return io;
};

export default connectToSocket;
