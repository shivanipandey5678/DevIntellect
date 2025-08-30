import React from 'react';
import { Send, User, Bot } from "lucide-react";
import { AnimatedThemeToggler } from "@/components/magicui/animated-theme-toggler"
import { AnimatedGradientText } from "@/components/magicui/animated-gradient-text";
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';


const ChatLeft = () => {
  const SYSTEM_PROMPT = `
  You are a helpful assistant. - First, think about the question ("THINK"), then evaluate your options ("EVALUATE"), and finally respond clearly in several points ("ANSWER"). - Structure the response in clear steps, in bullet points, avoiding long paragraphs. - For long texts, start with a summary of 4-5 lines, then provide details in bullet points. - End with a question to continue or clarify.

`
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  async function sendMessage() {
    const res = await fetch("http://localhost:5000/api/chat", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: input, systemPrompt: SYSTEM_PROMPT })
    });

    const data = await res.json();

    setMessages([...messages, { role: 'user', content: input }, { role: 'ai', content: data.reply }]);
    setInput('');
  }

  return (
    <div className="relative h-screen flex flex-col gap-4 h overflow-hidden">
      {/* Top Header */}
      <div className="sticky top-0 z-50 backdrop-blur-md w-full bg-gray-100 dark:bg-gray-900 px-6 py-6 border flex justify-between ">
        <div><AnimatedGradientText>Ask Anything...</AnimatedGradientText></div>
        <div className='flex gap-3'>
          <AnimatedThemeToggler />
          <User size={24} className="text-gray-600" />
        </div>


      </div>

      {/* Middle Scrollable Content */}
      <div className="flex-1 w-[80%] mx-auto  overflow-auto pb-20">

        {messages.length === 0 ? (<h1 className='text-center  text-2xl font-bold mt-10'> Start your conversation after clicking on send button please wait for sometimes don't press it again and again ...</h1>) : messages.map((msg, index) => (
          <div
            key={index}
            className={`flex items-start gap-2  my-2 ${msg.role === "user" ? "justify-end" : "justify-start"
              }`}
          >
            {/* Icon on left/right */}
            {msg.role === "ai" && (
              <Bot size={20} className="text-[var(--primary)] mt-1" />
            )}
            <div
              className={`pl-4 py-2 pr-8 rounded-2xl max-w-[70%] ${msg.role === "user"
                ? "bg-[var(--primary)] text-white"
                : "bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                }`}
            >
              <ReactMarkdown>{msg.content}</ReactMarkdown>
            </div>
            {msg.role === "user" && (
              <User size={20} className="text-[var(--primary)] mt-1" />
            )}
          </div>
        ))}





      </div>

      {/* Bottom Search Bar */}
      <div className="w-[80%] mx-auto flex mb-4">
        <input
          type="text"
          className="flex border rounded-full flex-1 mr-1 bg-gray-100 px-6 py-2 dark:placeholder:text-gray-600"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button className="min-w-8 aspect-square rounded bg-[var(--primary)] flex items-center justify-center p-2 cursor-pointer" onClick={sendMessage}>
          <Send size={20} className='text-white' />
        </button>
      </div>
    </div>
  );
};

export default ChatLeft;
