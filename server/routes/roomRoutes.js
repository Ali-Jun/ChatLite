import express from 'express';
import Room from '../models/Room.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

router.use(protect);

router.post('/', async (req, res) => {
  try {
    const cleanName = req.body.name?.trim();

    if (!cleanName) {
      return res.status(400).json({ message: 'Room name is required.' });
    }

    if (cleanName.length < 2 || cleanName.length > 50) {
      return res.status(400).json({ message: 'Room name must be between 2 and 50 characters.' });
    }

    const existingRoom = await Room.findOne({
      name: { $regex: new RegExp(`^${escapeRegExp(cleanName)}$`, 'i') }
    });

    if (existingRoom) {
      return res.status(409).json({ message: 'A room with this name already exists.' });
    }

    const room = await Room.create({
      name: cleanName,
      createdBy: req.user._id
    });

    const populatedRoom = await room.populate('createdBy', 'name email');

    return res.status(201).json(populatedRoom);
  } catch (error) {
    return res.status(500).json({ message: 'Could not create room. Please try again.' });
  }
});

router.get('/', async (_req, res) => {
  try {
    const rooms = await Room.find()
      .populate('createdBy', 'name email')
      .sort({ updatedAt: -1, createdAt: -1 });

    return res.json(rooms);
  } catch (error) {
    return res.status(500).json({ message: 'Could not load rooms. Please try again.' });
  }
});

export default router;
