import express from 'express';
const Router = express.Router();
import chatWithBot from '../controllers/chatWithBot.js';
import fileUpload from '../controllers/filesUpload.js';
import multer from 'multer';
const upload = multer({ dest: "uploads/" });

Router.post('/chat',chatWithBot);
Router.post('/fileUpload', upload.single("file") ,fileUpload);

export default Router;