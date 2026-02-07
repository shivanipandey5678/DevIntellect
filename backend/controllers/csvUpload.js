import dotenv from "dotenv";
import multer from "multer";
import fs from "fs";
import { OpenAIEmbeddings } from "@langchain/openai";
import { QdrantVectorStore } from "@langchain/qdrant";
import { CSVLoader } from "@langchain/community/document_loaders/fs/csv";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { getQdrantFriendlyMessage } from "../utils/qdrantError.js";

dotenv.config();

const upload = multer({ dest: "uploads/" }); 

// 🔹 helper function -> chunks ko batches me bhejna
async function saveChunksInBatches(chunks, embeddings, batchSize = 200,originalname,mimetype) {
  for (let i = 0; i < chunks.length; i += batchSize) {
    const batch = chunks.slice(i, i + batchSize);
    
    const batchWithMeta = batch.map((doc) => {
    
        return {
          pageContent: doc.pageContent, 
          metadata: {
            ...doc.metadata,             
            filename: originalname, 
            filetype: mimetype,     
            uploadedAt: new Date().toISOString(), 
          },
        };
      });
    console.log(`👉 Sending batch ${i / batchSize + 1}, size: ${batch.length}`);

    // existing collection me add karna hai (overwrite nhi)
    const vectorStore = await QdrantVectorStore.fromDocuments(
      batchWithMeta,
      embeddings,
      {
        url: process.env.QDRANT_URL,
        collectionName: "universalCollection",
      }
    );

    console.log(`✅ Batch ${i / batchSize + 1} stored`);
  }
}

export const loadCSV = [
  upload.single("CsvPath"), // <-- multer middleware
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }
      const CsvPath = req.file.path;
      const originalname = req.file.originalname;
      const mimetype = req.file.mimetype;
      console.log("📂 File Path:", CsvPath);
      console.log("📂 File Name:", originalname);
      console.log("📂 MIME Type:", mimetype);
      let loader;
      let docs;
      if (mimetype === "text/csv") {
        console.log("CSV file hai");
        loader = new CSVLoader(CsvPath);
      
         docs = await loader.load();
         console.log("🟢CSV file hai",docs)
      } else if (mimetype === "application/pdf") {
        loader = new PDFLoader(CsvPath);
        docs = await loader.load();
        console.log("⏳PDF file hai",docs);
      } else if (mimetype === "text/plain" || CsvPath.endsWith(".txt")) {
        loader = new TextLoader(CsvPath);
        docs = await loader.load();
        console.log("Text file hai👩‍💻",docs);
      } else {
        throw new Error("Unsupported file type");
      }

      // LangChain CSV Loader
     
     
      // Embeddings
      if (!docs || docs.length === 0) {
        return res.status(422).json({ error: "No content could be extracted from the file." });
      }

      const embeddings = new OpenAIEmbeddings({
        apiKey: process.env.OPENAI_API_KEY,
      });

      const totalLen = docs.reduce((a, d) => a + (d.pageContent?.length || 0), 0);
      const avgLength = totalLen / docs.length;
      const chunkSize = Number.isFinite(avgLength) && avgLength < 200 ? 40 : 200;

      // Split chunks
      const splitter = new RecursiveCharacterTextSplitter({
        chunkSize, // thoda aur kam karna ho to 100 bhi try kar sakti ho
        chunkOverlap: 10,
      });
      
      // console.log("😱clear",splitter)
      const chunks = await splitter.splitDocuments(docs);
      console.log("Chunks created: 💪💪💪", chunks);

      // Store in Qdrant (batch by batch)
      await saveChunksInBatches(chunks, embeddings, 400 ,originalname,mimetype);
      // if (fs.existsSync(CsvPath)) fs.unlinkSync(CsvPath);

      console.log("✅ Indexing done");

      // temp file delete after processing
      

      res.json({
        message: "File processed successfully",
        docsCount: docs.length,
        chunksCount: chunks.length,
      });
    } catch (error) {
      console.error("❌ File processing error:", error);
      const message = getQdrantFriendlyMessage(error) || error.message || String(error);
      res.status(500).json({
        error: "File processing failed",
        message,
      });
    }
  },
];
