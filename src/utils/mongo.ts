import mongoose from 'mongoose';
import config from '../config';

export async function connectToMongo() {
  try {
    const url = config.databaseURL;
    if (!url) {
      console.error('MongoDB uri Not Found');
      return;
    }

    await mongoose.connect(url);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}
