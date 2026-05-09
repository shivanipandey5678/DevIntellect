import express from 'express';
const Router = express.Router();
import chatWithBot from '../controllers/chatWithBot.js';
import fileUpload from '../controllers/filesUpload.js';
import multer from 'multer';
import {loadCSV} from '../controllers/csvUpload.js';
import { youtubelinkController } from '../controllers/youtubeLinkUpload.js';
import { websiteLinkController } from '../controllers/websiteLinkUpload.js';
const upload = multer({ dest: "uploads/" });

// Health check endpoint for deployment monitoring
Router.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

Router.post('/chat',chatWithBot);
Router.post('/youtubelink' ,youtubelinkController);
Router.post('/websitelink' ,websiteLinkController);
Router.post('/load-csv',loadCSV);


export default Router;
