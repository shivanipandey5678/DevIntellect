import { YoutubeLoader } from "@langchain/community/document_loaders/web/youtube";
import { OpenAIEmbeddings } from "@langchain/openai"; 
import { QdrantVectorStore } from "@langchain/qdrant";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import dotenv from "dotenv";

dotenv.config();


export async function youtubelinkController(req, res) {
  try {
    const { youtubeLink } = req.body;
    if (!youtubeLink) {
        return res.status(400).json({ success: false, message: "YouTube link is required" });
      }
    const loader = await YoutubeLoader.createFromUrl(youtubeLink, {
      language: "en",
      addVideoInfo: true,
    });

    const docs = await loader.load();

    const embeddings = new OpenAIEmbeddings({
        apiKey: process.env.OPENAI_API_KEY,
    });

    const avgLength = docs.map(d => d.pageContent.length).reduce((a, b) => a + b, 0) / docs.length;
    const chunkSize = avgLength < 200 ? 40 : 200;

    const splitter = new RecursiveCharacterTextSplitter({
        chunkSize, 
        chunkOverlap: 10,
    });

    const chunks = await splitter.splitDocuments(docs);

    for(let i=0; i<chunks.length;i+=100){
        const batch = chunks.slice(i, i + 100);
        const vectorStore = await QdrantVectorStore.fromDocuments(
            batch,
            embeddings,
            {
              url: process.env.QDRANT_URL,
              collectionName: "universalCollection",
            }
        );
    }


    console.log("💪💪💪",'Indexing of youtube video completed!!' );
  
    res.json({
        success: true,
        message: "YouTube link processed successfully",
        docsCount: docs.length,
        data: docs,
      });
      
  } catch (error) {
    res.status(500).json({
        success: false,
        message: error.message || "Something went wrong",
      });
      
  }
}
