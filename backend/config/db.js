import dotenv from "dotenv";
dotenv.config({path:'../.env'});
console.log(process.env.QDRANT_URL,"process.env.QDRANT_URL in db ❌❌")
import { QdrantVectorStore } from "@langchain/qdrant";
import { OpenAIEmbeddings } from "@langchain/openai";

const embeddings = new OpenAIEmbeddings({
  model: "text-embedding-3-small",
});

