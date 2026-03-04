import app from './src/app.js';
import config from './src/config/config.js';
import connectDB from './src/db/db.js';
import { createServer } from 'http';
import { connectToSocket } from './src/controllers/socketManager.js';

connectDB();

const server = createServer(app);
const io = connectToSocket(server);

server.listen(config.PORT || 3000, () => {
    console.log(`Server & WebSocket running on port ${config.PORT || 3000}`);
});