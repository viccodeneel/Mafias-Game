import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { setupSocket } from './socket.js';

const app = express();

const allowedOrigin = "https://mafias-game.vercel.app";

app.use(cors({
  origin: allowedOrigin
}));

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: allowedOrigin,
    methods: ['GET', 'POST'],
  },
});

setupSocket(io);

const PORT = process.env.PORT || 3001;

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});