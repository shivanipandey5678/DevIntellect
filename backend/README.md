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
    res.json({ reply:data.choices[0].message.content });