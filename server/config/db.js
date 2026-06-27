import mongoose from 'mongoose';

let memoryServer;

const connectDB = async () => {
  try {
    if (process.env.USE_MEMORY_MONGO === 'true') {
      const { MongoMemoryServer } = await import('mongodb-memory-server');
      memoryServer = await MongoMemoryServer.create();
      process.env.MONGO_URI = memoryServer.getUri();
      console.log('In-memory MongoDB started for local development.');
    }

    if (!process.env.MONGO_URI) {
      console.error('MONGO_URI is missing. Add it to your server .env file.');
      process.exit(1);
    }

    const connection = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected: ${connection.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection failed: ${error.message}`);
    process.exit(1);
  }
};

export const stopMemoryDB = async () => {
  if (memoryServer) {
    await memoryServer.stop();
  }
};

export default connectDB;