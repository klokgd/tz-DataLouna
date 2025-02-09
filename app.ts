import 'dotenv/config';
import express from 'express';
import authRoutes from './routes/authRoutes';
import cookieParser from 'cookie-parser';
import itemRoutes from './routes/itemRoutes';

const app = express();
app.use(cookieParser());
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/item', itemRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});