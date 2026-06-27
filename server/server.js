import dotenv from 'dotenv';
dotenv.config();

import cors from 'cors';
import express from 'express';
import http from 'http';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { Server } from 'socket.io';
import connectDB from './config/db.js';
import Message from './models/Message.js';
import Room from './models/Room.js';
import User from './models/User.js';
import authRoutes from './routes/authRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import roomRoutes from './routes/roomRoutes.js';

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5000;
const corsOrigins = (process.env.CLIENT_URL || 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

if (!process.env.JWT_SECRET) {
  console.error('JWT_SECRET is missing. Add it to your server .env file.');
  process.exit(1);
}

await connectDB();

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || corsOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error('Not allowed by CORS.'));
    },
    credentials: true
  })
);
app.use(express.json({ limit: '1mb' }));

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', app: 'ChatLite' });
});

app.use('/api/auth', authRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/messages', messageRoutes);

const io = new Server(server, {
  cors: {
    origin: corsOrigins,
    methods: ['GET', 'POST'],
    credentials: true
  }
});

const formatMessage = (message) => ({
  _id: message._id,
  room: message.room.toString(),
  sender: {
    _id: message.sender._id,
    name: message.sender.name,
    email: message.sender.email
  },
  text: message.text,
  createdAt: message.createdAt,
  updatedAt: message.updatedAt
});

io.use(async (socket, next) => {
  try {
    const authToken = socket.handshake.auth?.token;
    const headerToken = socket.handshake.headers?.authorization?.split(' ')[1];
    const token = authToken || headerToken;

    if (!token) {
      return next(new Error('Authentication error: token missing.'));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return next(new Error('Authentication error: user not found.'));
    }

    socket.user = {
      id: user._id.toString(),
      name: user.name,
      email: user.email
    };

    return next();
  } catch (error) {
    return next(new Error('Authentication error: invalid token.'));
  }
});

io.on('connection', (socket) => {
  socket.on('joinRoom', async (roomId, callback) => {
    try {
      if (!mongoose.Types.ObjectId.isValid(roomId)) {
        return callback?.({ success: false, message: 'Invalid room id.' });
      }

      const room = await Room.findById(roomId);

      if (!room) {
        return callback?.({ success: false, message: 'Room not found.' });
      }

      socket.join(roomId);
      return callback?.({ success: true, roomId });
    } catch (error) {
      return callback?.({ success: false, message: 'Could not join room.' });
    }
  });

  socket.on('sendMessage', async (payload, callback) => {
    try {
      const roomId = payload?.roomId;
      const text = payload?.text?.trim();

      if (!mongoose.Types.ObjectId.isValid(roomId)) {
        return callback?.({ success: false, message: 'Invalid room id.' });
      }

      if (!text) {
        return callback?.({ success: false, message: 'Message cannot be empty.' });
      }

      if (text.length > 1000) {
        return callback?.({ success: false, message: 'Message is too long.' });
      }

      const room = await Room.findById(roomId);

      if (!room) {
        return callback?.({ success: false, message: 'Room not found.' });
      }

      const message = await Message.create({
        room: roomId,
        sender: socket.user.id,
        text
      });

      await Room.findByIdAndUpdate(roomId, { updatedAt: new Date() });
      const populatedMessage = await message.populate('sender', 'name email');
      const responseMessage = formatMessage(populatedMessage);

      io.to(roomId).emit('newMessage', responseMessage);
      return callback?.({ success: true, message: responseMessage });
    } catch (error) {
      return callback?.({ success: false, message: 'Could not send message.' });
    }
  });
});

app.use((_req, res) => {
  res.status(404).json({ message: 'Route not found.' });
});

server.listen(PORT, () => {
  console.log(`ChatLite server running on port ${PORT}`);
});
