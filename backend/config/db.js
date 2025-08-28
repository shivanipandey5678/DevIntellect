import dotenv from "dotenv";
dotenv.config({ path: "../.env" });

import { QdrantVectorStore } from "@langchain/qdrant";
import { OpenAIEmbeddings } from "@langchain/openai";

const embeddings = new OpenAIEmbeddings({
  model: "text-embedding-3-small",
});

// const vectorStore = await QdrantVectorStore.fromDocuments(embeddings, {
//   url: process.env.QDRANT_URL,
//   collectionName: "",
// });