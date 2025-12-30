import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import fs from 'fs';
import mediaRoutes from './routes/mediaRoutes';
import chatRoutes from './routes/chatRoutes';

const app = express();
app.use(cors()); 
app.use(express.json());

if (!fs.existsSync('uploads')) fs.mkdirSync('uploads');


app.use('/media', mediaRoutes); // Meeting/Video logic
app.use('/chat', chatRoutes);   // Reading/Static text logic

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`FocusFlow Backend running on http://localhost:${PORT}`);
});