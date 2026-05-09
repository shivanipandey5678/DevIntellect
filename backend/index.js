import express from 'express';
import dotenv from "dotenv";
import fetch from "node-fetch";
import cors from "cors";
import Router from './Router/router.js';


dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded())
app.use(cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",  
    methods: ["GET", "POST"],
    credentials: true
  }));

app.use('/api',Router)

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));