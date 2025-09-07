import { CheerioWebBaseLoader } from "@langchain/community/document_loaders/web/cheerio";
import { PuppeteerWebBaseLoader } from "@langchain/community/document_loaders/web/puppeteer";
import { OpenAIEmbeddings } from "@langchain/openai";
import { QdrantVectorStore } from "@langchain/qdrant";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

export async function websiteLinkController(req, res) {
  try {
    const { websiteLnk } = req.body;
    if (!websiteLnk) {
      return res.status(400).json({ success: false, message: "Website link is required" });
    }

    let docs = [];
    try {
      // Step 1: Try Cheerio (fast for static HTML sites)
      const cheerioLoader = new CheerioWebBaseLoader(websiteLnk);
      docs = await cheerioLoader.load();

      // Step 2: Fallback to Puppeteer (for JS-rendered sites)
      if (docs.length === 0 || !docs[0].pageContent.trim()) {
        console.log("⚡ Static load failed. Trying Puppeteer...");
        const puppeteerLoader = new PuppeteerWebBaseLoader(websiteLnk, {
         
          gotoOptions: { waitUntil: "domcontentloaded" },
        });
        docs = await puppeteerLoader.load();
      }
    } catch (err) {
      throw new Error("Failed to load website content: " + err.message);
    }

    // 🔹 Embeddings
    const embeddings = new OpenAIEmbeddings({
      apiKey: process.env.OPENAI_API_KEY,
    });

    // 🔹 Chunking
    const avgLength = docs.map(d => d.pageContent.length).reduce((a, b) => a + b, 0) / docs.length;
    const chunkSize = avgLength < 200 ? 40 : 200;

    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize,
      chunkOverlap: 10,
    });

    const chunks = await splitter.splitDocuments(docs);

    // 🔹 Save in Qdrant in batches
    for (let i = 0; i < chunks.length; i += 100) {
      const batch = chunks.slice(i, i + 100);
      await QdrantVectorStore.fromDocuments(batch, embeddings, {
        url: process.env.QDRANT_URL,
        collectionName: "universalCollection",
      });
    }

    console.log("✅ Website indexing completed!");

    const websiteTitle =
    docs[0]?.metadata?.title ||
    docs[0]?.metadata?.source ||
    websiteLnk;

    res.json({
      success: true,
      message: "Website processed and indexed successfully",
      docsCount: docs.length,
      chunksCount: chunks.length,
      websiteName: websiteTitle,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
}
