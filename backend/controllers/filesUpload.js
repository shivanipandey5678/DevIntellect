import dotenv from "dotenv";
dotenv.config();
import { OpenAIEmbeddings } from "@langchain/openai"; 
import { QdrantVectorStore } from "@langchain/qdrant";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { TextLoader } from "langchain/document_loaders/fs/text"; 
import { CSVLoader } from "@langchain/community/document_loaders/fs/csv";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
console.log(process.env.QDRANT_URL)


async function loadAndUpload(filePath ,fileName){
    let loader;
    if (fileName.toLowerCase().endsWith(".pdf")) {
        loader = new PDFLoader(filePath);
      } else if (fileName.toLowerCase().endsWith(".csv")) {
        loader = new CSVLoader(filePath);
      } else {
        loader = new TextLoader(filePath);
      }
    
    const docs = await loader.load();
    console.log("Loaded docs:", docs.length);
    
    const embeddings = new OpenAIEmbeddings({ apiKey: process.env.OPENAI_API_KEY });
    
    const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 200,
        chunkOverlap: 10,
    });

    const chunks = await splitter.splitDocuments(docs); 
    console.log("Chunks created:", chunks.length);

    const vectorStore = new QdrantVectorStore({
        url:process.env.QDRANT_URL,
        collectionName: "universalCollection",
    
    });

     // Batch upload
  const batchSize = 500; // adjust based on payload
  for (let i = 0; i < chunks.length; i += batchSize) {
    const batch = chunks.slice(i, i + batchSize);
    await vectorStore.addDocuments(batch, embeddings);
    console.log(`Uploaded batch ${i / batchSize + 1}`);
  }

  console.log("✅ Indexing done");

   
}

const fileUpload= async (req,res) => {
    try {
        const filePath = req.file.path;
        console.log("File uploaded at:", filePath, "Original name:", req.file.originalname);
        await loadAndUpload(filePath , req.file.originalname);

        res.json({ success: true, msg: "Indexing complete ✅" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, msg: error });
    }
}

export default fileUpload;



