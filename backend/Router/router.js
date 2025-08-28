import express from 'express';
const Router = express.Router();
import { MultiFileLoader } from "langchain/document_loaders/fs/multi_file";
import {
  JSONLoader,
  JSONLinesLoader,
} from "langchain/document_loaders/fs/json";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { CSVLoader } from "langchain/document_loaders/fs/csv";


Router.post('/api/file',async(req,res)=>{
    try {
        const {file} = req.body;
        if(!file){
            return res.json({success:false,message:"please do provide file"})
        }

        const loader = new MultiFileLoader(
            [
                file
            ],
            {
              ".json": (path) => new JSONLoader(path, "/texts"),
              ".jsonl": (path) => new JSONLinesLoader(path, "/html"),
              ".txt": (path) => new TextLoader(path),
              ".csv": (path) => new CSVLoader(path, "text"),
            }
          );

    } catch (error) {
        res.json({success:false,message:error})
    }
})