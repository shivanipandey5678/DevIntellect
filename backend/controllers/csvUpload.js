import dotenv from "dotenv";
import multer from "multer";
import fs from "fs";
import { OpenAIEmbeddings } from "@langchain/openai"; 
import { QdrantVectorStore } from "@langchain/qdrant";
import { CSVLoader } from "@langchain/community/document_loaders/fs/csv";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";


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
  async (doc, res) => {
    try {
      // multer se file ka path
      const CsvPath = doc.file.path;
      let originalname = doc.file.originalname;
      let mimetype= doc.file.mimetype;
      console.log("📂 File Path:", CsvPath);
      console.log("📂 File Name:", originalname);
      console.log("📂 MIME Type:", mimetype);
      let loader;
      let docs;
      if (mimetype === "text/csv") {
        console.log("CSV file hai");
        loader = new CSVLoader(CsvPath);
      
         docs = await loader.load();
      } else if (mimetype === "application/pdf") {
        loader = new PDFLoader(CsvPath);
        docs = await loader.load();
        console.log("PDF file hai");
      } else if (mimetype === "text/plain" || CsvPath.endsWith(".txt")) {
        loader = new TextLoader(CsvPath);
        docs = await loader.load();
        console.log("Text file hai");
      } else {
        throw new Error("Unsupported file type");
      }

      // LangChain CSV Loader
     
     
      // Embeddings
      const embeddings = new OpenAIEmbeddings({
        apiKey: process.env.OPENAI_API_KEY,
      });

      const avgLength = docs.map(d => d.pageContent.length).reduce((a, b) => a + b, 0) / docs.length;
      const chunkSize = avgLength < 200 ? 40 : 200;

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
      console.error("❌ Error:", error);
      res.status(500).json({ error: "File processing failed" });
    }
  },
];
