import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const connectDatabase = async function () {
  const MONGODB_URL =
    process.env.MONGODB_URL ||
    'mongodb+srv://storeaccommodation:rMniA6Za3ac2Mp5o@accommodation.tdjpuzz.mongodb.net/accommodation?retryWrites=true&w=majority&appName=accommodation';
  try {
    mongoose.set('strictQuery', false);
    await mongoose.connect(MONGODB_URL);
    console.log(`Connected to MongoDb successfuly: ${MONGODB_URL}`);
  } catch (error) {
    console.log('Cannot connect to MongoDb');
    console.log(error);
  }
};

export default connectDatabase;
