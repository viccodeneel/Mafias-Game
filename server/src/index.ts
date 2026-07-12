import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { setupSocket } from './socket.js';

const app = express();
app.use(cors());

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "https://mafias-game.vercel.app/",
    methods: ['GET', 'POST'],
  },
});
app.use(cors({
  origin: "https://mafias-game.vercel.app/"
}));

setupSocket(io);

const PORT = process.env.PORT || 3001;

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
