import mongoose from 'mongoose';
import 'dotenv/config';

const connectDB = async () => {

   mongoose.connection.on('connected', () => {
       console.log('MongoDB Database connected');
   });

   await mongoose.connect(`${process.env.MONGODB_URI}/mern-auth`);
};

export default connectDB;
