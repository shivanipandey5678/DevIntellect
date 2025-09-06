import express from 'express';
const Router = express.Router();
import chatWithBot from '../controllers/chatWithBot.js';
import fileUpload from '../controllers/filesUpload.js';
import multer from 'multer';
import {loadCSV} from '../controllers/csvUpload.js';
import { youtubelinkController } from '../controllers/youtubeLinkUpload.js';
import { websiteLinkController } from '../controllers/websiteLinkUpload.js';
const upload = multer({ dest: "uploads/" });



Router.post('/chat',chatWithBot);
Router.post('/youtubelink' ,youtubelinkController);
Router.post('/websitelink' ,websiteLinkController);
Router.post('/load-csv',loadCSV);


export default Router;
