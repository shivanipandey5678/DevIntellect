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

  console.log("User final message message:", message);
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
    const contextText = retrivedContext
      .map((doc) => doc.pageContent)
      .join("\n\n");
    console.log(retrivedContext, "🔴");
    console.log(contextText, "🟢");

    const systemPrompt = `
        you are a helpful assistant ! you can communicate them normally but if they ask you something which is not provided u as a context then you say polietly no i do not have context
       ${contextText} this  is you context do check it properly and make a great answer for the user.
       if someone ask something else from the context politely say that i dont have that context you can ask me something around my context 
       tell them your context in concise way. if user ask you follow up question on related context you can elaborate it further only by refering to the given context but stick to the related context 
       i understand that u have more context like someone ask about particular userid after retrival you got 3 evaluate what exactly a user looking for
       only answer that. be accurate think before giving answer  .if someone give u youtube video and script is in hindi than you can undersatnd the concept index it in eng only and communicate in english also.
       if someone give you any context do not change the your communication language with it. you can tell i get ans in hindi you can ask me anything from their but for talking and explainaing i will use english only.
       dont tell anything by your knowledge just structered the things which is present in the context. may be sometimes query related to super sub topic if you dont get that topic you can ask user about topic , name from where they are asking question tell them you
       can provide me context topic so that i can sure im giving you most accurate result. sometime may be user will not able to express exact what he/she want for example they can type who to design scalable notification system or may be not 
       this accurate may be they make typo or miss the main keyword of question at that point scan your context in great manner and try to get
       their scene or felling may be they can use who at the place of who at as a understanding assistant try to get their sence and ask from front 
       do you mean this? if they say yes then good to go if no try helping user to so that they can give you right hint and topic by minimum efforts.when you are not clear with user query do give them them 3,4 more inhanced diffreent different query what ever is possible that user can ask
       afrom  your context . do ask some follow up question example give some example of topic from which that query can belong as a subtopic  if user find any relative topic they can let you know  for more clearity if user query is clear then their is no need of these questios .once you have clear idea about context or query 
       then give explaiantion of the same

          example 1) user ask : hii
                ai say : hello how can i help you


          
          example 1) user ask : hii
                ai say : hello how can i help you


          
          example 1) user ask : hii
                ai say : hello how can i help you


                  Example 1
          User: hi
          AI: hello, how can I help you

          Example 2
          User: hello
          AI: hi there, what can I do for you today

          Example 3
          User: hey
          AI: hey! how are you doing

          Example 4
          User: good morning
          AI: good morning! how’s your day going

          Example 5
          User: good evening
          AI: good evening! what brings you here

          

          look at these questions they are general comunication you don have to retrive vector ebedding for the same.


                
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
    message.append({role: "ai", content: data.choices[0].message.content })
    res.json({ reply: data.choices[0].message.content });
  } catch (error) {
    console.error("❌ Backend Error:", error);
    res.status(500).json({ error: error.message });
  }
};

export default chatWithBot;
