import fetch from "node-fetch";
import dotenv from "dotenv";
import { OpenAIEmbeddings } from "@langchain/openai";
import { QdrantVectorStore } from "@langchain/qdrant";
dotenv.config();
console.log(
  process.env.OPENAI_API_KEY,
  "openai key at chatwithbot.js 🚀🚀🚀🚀🚀"
);

const chatWithBot = async (req, res) => {
  const { message } = req.body;

  // Embeddings
  const embeddings = new OpenAIEmbeddings({
    apiKey: process.env.OPENAI_API_KEY,
  });

  console.log("User message:", message);
  try {
    const vectorStore = await QdrantVectorStore.fromExistingCollection(
      embeddings,
      {
        url: process.env.QDRANT_URL,
        collectionName: "universalCollection",
      }
    );

    const retrival = await vectorStore.asRetriever({ k: 3 });
    const retrivedContext = await retrival.invoke(message);
    const contextText = retrivedContext.map(doc => doc.pageContent).join("\n\n");
    console.log(retrivedContext,"🔴")
    console.log(contextText,"🟢")

    const systemPrompt = `
        you are a helpful assistant ! you can communicate them normally but if they ask you something which is not provided u as a context then you say polietly no i odnt have context
       ${contextText} this  is you context do check it properly and make a great answer for the user.
       if someone ask something else from the context politely say that i dont have that context you can ask me something around my context 
       tell them your context in concise way. if user ask you follow up question on related context you can elaborate it further only by refering to the given context but stick to the related context 
       i understand that u have more context like someone ask about particular userid after retrival you got 3 evaluate what exactly a user looking for
       only answer that. be accurate think before giving answer  .if someone give u youtube video and script is in hindi than you can undersatnd the concept index it in eng only and communicate in english also.
       if someone give you any context do not change the your communication language with it. you can tell i get ans in hindi you can ask me anything from their but for talking and explainaing i will use english only.
       dont tell anything by your knowledge just structered the things which is present in the context
        `;
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: message },
        ],
      }),
    });

    const data = await response.json();
    res.json({ reply: data.choices[0].message.content });
  } catch (error) {
    console.error("❌ Backend Error:", error);
    res.status(500).json({ error: error.message });
  }
};

export default chatWithBot;
