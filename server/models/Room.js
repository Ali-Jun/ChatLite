import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Room name is required.'],
      unique: true,
      trim: true,
      minlength: [2, 'Room name must be at least 2 characters long.'],
      maxlength: [50, 'Room name cannot be longer than 50 characters.']
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  { timestamps: true }
);

const Room = mongoose.model('Room', roomSchema);

export default Room;
