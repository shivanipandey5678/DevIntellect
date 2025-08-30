import express from 'express';
import dotenv from "dotenv";
import fetch from "node-fetch";
import cors from "cors";
import Router from './Router/router.js';


dotenv.config();
const app = express();
app.use(express.json());
app.use(cors({
    origin: "http://localhost:5173",  
    methods: ["GET", "POST"],
  }));

app.use('/api',Router)

app.listen(5000, () => console.log("Server running on port 5000"));