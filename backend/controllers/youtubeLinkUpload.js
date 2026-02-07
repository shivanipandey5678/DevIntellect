import { YoutubeTranscript } from "youtube-transcript";
import { OpenAIEmbeddings } from "@langchain/openai";
import { QdrantVectorStore } from "@langchain/qdrant";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { getQdrantFriendlyMessage } from "../utils/qdrantError.js";
import dotenv from "dotenv";

dotenv.config();

function getVideoId(urlOrId) {
  if (!urlOrId || typeof urlOrId !== "string") return null;
  const trimmed = urlOrId.trim();
  const match = trimmed.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  if (match) return match[1];
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) return trimmed;
  return null;
}

export async function youtubelinkController(req, res) {
  try {
    const { youtubeLink } = req.body;
    if (!youtubeLink || !youtubeLink.trim()) {
      return res.status(400).json({ success: false, message: "YouTube link is required" });
    }

    const videoId = getVideoId(youtubeLink);
    if (!videoId) {
      return res.status(400).json({
        success: false,
        message: "Invalid YouTube URL. Use format: https://www.youtube.com/watch?v=VIDEO_ID or https://youtu.be/VIDEO_ID",
      });
    }

    let transcriptItems;
    try {
      transcriptItems = await YoutubeTranscript.fetchTranscript(videoId);
    } catch (err) {
      console.error("YouTube transcript error:", err);
      return res.status(400).json({
        success: false,
        message: "Failed to get YouTube video transcription: " + (err.message || "Video may be private, have no captions, or the transcript API is unavailable."),
      });
    }

    if (!transcriptItems || transcriptItems.length === 0) {
      return res.status(422).json({
        success: false,
        message: "No transcript available for this video (captions may be disabled).",
      });
    }

    const fullText = transcriptItems.map((item) => item.text).join(" ");
    const docs = [
      {
        pageContent: fullText,
        metadata: {
          source: `https://www.youtube.com/watch?v=${videoId}`,
          title: `YouTube Video ${videoId}`,
          videoId,
        },
      },
    ];

    const embeddings = new OpenAIEmbeddings({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const totalLen = fullText.length;
    const avgLength = totalLen / docs.length;
    const chunkSize = Number.isFinite(avgLength) && avgLength < 200 ? 40 : 200;

    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize,
      chunkOverlap: 10,
    });

    const chunks = await splitter.splitDocuments(docs);

    for (let i = 0; i < chunks.length; i += 100) {
      const batch = chunks.slice(i, i + 100);
      await QdrantVectorStore.fromDocuments(batch, embeddings, {
        url: process.env.QDRANT_URL,
        collectionName: "universalCollection",
      });
    }

    console.log("YouTube indexing completed for video:", videoId);

    res.json({
      success: true,
      message: "YouTube link processed successfully",
      docsCount: docs.length,
      data: docs,
    });
  } catch (error) {
    console.error("YouTube controller error:", error);
    const message = getQdrantFriendlyMessage(error) || error.message || "Something went wrong";
    res.status(500).json({ success: false, message });
  }
}
