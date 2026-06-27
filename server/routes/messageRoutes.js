import express from 'express';
import mongoose from 'mongoose';
import Message from '../models/Message.js';
import Room from '../models/Room.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/:roomId', async (req, res) => {
  try {
    const { roomId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(roomId)) {
      return res.status(400).json({ message: 'Invalid room id.' });
    }

    const room = await Room.findById(roomId);

    if (!room) {
      return res.status(404).json({ message: 'Room not found.' });
    }

    const messages = await Message.find({ room: roomId })
      .populate('sender', 'name email')
      .sort({ createdAt: 1 })
      .limit(100);

    return res.json(messages);
  } catch (error) {
    return res.status(500).json({ message: 'Could not load messages. Please try again.' });
  }
});

export default router;
