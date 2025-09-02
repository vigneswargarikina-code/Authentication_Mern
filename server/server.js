import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './config/mongodb.js'
import authRouter from './Routes/authRoutes.js';
import userRouter from './Routes/userRoutes.js';
const app = express();
const port = process.env.PORT || 4000;
connectDB();
const allowedOrigins = ['http://localhost:5173'];
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));
//API END POINTS
app.get('/',(req,res)=>res.send('API is running...siddhu'));
app.use('/api/auth',authRouter);
app.use('/api/user',userRouter);
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
