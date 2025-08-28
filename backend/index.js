import express from 'express';
import dotenv from "dotenv";
import fetch from "node-fetch";
import cors from "cors";



dotenv.config();
const app = express();
app.use(express.json());
app.use(cors({
    origin: "http://localhost:5173",  
    methods: ["GET", "POST"],
  }));


app.post('/api/chat',async(req,res)=>{
    const { message ,systemPrompt} = req.body;
    console.log("User message:", message);
    try {
        const response = await fetch("https://api.openai.com/v1/chat/completions",{
            method:'POST',
            headers:{
                'Content-Type':'application/json',
                'Authorization':`Bearer ${process.env.OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-4o-mini",
                messages: [  { role: "system", content: systemPrompt },{ role: "user", content: message }
                  
                ],
            }),
        })
        
    const data = await response.json();
    
    res.json({ reply: data.choices[0].message.content });
    } catch (error) {
        console.error("❌ Backend Error:", error);
        res.status(500).json({ error: error.message });
    }
})

app.listen(5000, () => console.log("Server running on port 5000"));