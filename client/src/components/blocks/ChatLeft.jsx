import React from "react";
import { Send, User, Bot } from "lucide-react";
// import { AnimatedThemeToggler } from "@/components/magicui/animated-theme-toggler"
import { AnimatedGradientText } from "@/components/magicui/animated-gradient-text";
import { useState } from "react";
import ReactMarkdown from "react-markdown";

import { AnimatedThemeToggler } from "../blocks/animated-theme-toggler.jsx";

const ChatLeft = () => {
  const SYSTEM_PROMPT = `
  You are a helpful assistant. - First, think about the question ("THINK"), then evaluate your options ("EVALUATE"), and finally respond clearly in several points ("ANSWER"). - Structure the response in clear steps, in bullet points, avoiding long paragraphs. - For long texts, start with a summary of 4-5 lines, then provide details in bullet points. - End with a question to continue or clarify.

`;
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  async function sendMessage() {
    if (!input || !input.trim()) {
      return res.json({
        success: false,
        message: "please type something first!",
      });
    }
    setMessages((prev) => [...prev, { role: "user", content: input }]);
    setInput("");
    setMessages((prev) => [...prev, { role: "ai", content: "Thinking ⏳" }]);
    const res = await fetch("http://localhost:5000/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: input, systemPrompt: SYSTEM_PROMPT }),
    });

    const data = await res.json();
    setMessages((prev) => [
      ...prev.slice(0, -1),
      { role: "ai", content: data.reply },
    ]);
  }

  return (
    <div className="relative h-screen flex flex-col gap-4 h overflow-hidden">
      {/* Top Header */}
      <div className="sticky top-0 z-50 backdrop-blur-md w-full bg-white/50 dark:bg-gray-900/50 border-b flex justify-between items-center px-6 py-4 shadow-md">
        {/* Left: Logo + Animated Text */}
       
          <AnimatedGradientText className="text-2xl font-bold">
            Ask Anything...
          </AnimatedGradientText>
     

      
        <div className="flex gap-3 items-center">
          <AnimatedThemeToggler />
          <User
            size={28}
            className="text-[var(--primary)] hover:scale-110 transition-transform duration-200 cursor-pointer"
          />
        </div>
      </div>

      {/* Middle Scrollable Content */}
      <div className="flex-1 w-[80%] mx-auto  overflow-auto pb-20">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center mt-10 gap-4 text-center">
            {/* Fun Icon */}
            <Bot size={48} className="text-[var(--primary)] animate-bounce" />

            {/* Animated/fancy text */}
            <AnimatedGradientText className="text-2xl font-bold">
              Hello! Ask me anything 🤖
            </AnimatedGradientText>

            {/* Supporting text */}
            <p className="text-gray-500 dark:text-gray-400 max-w-[400px]">
              Type your question in the box below and let's have some fun
              learning together!
            </p>
          </div>
        ) : (
          messages.map((msg, index) => (
            <div
              key={index}
              className={`flex items-start gap-2  my-2 ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {/* Icon on left/right */}
              {msg.role === "ai" && (
                <Bot size={20} className="text-[var(--primary)] mt-1" />
              )}
              <div
                className={`pl-4 py-2 pr-8 rounded-2xl max-w-[70%] ${
                  msg.role === "user"
                    ? "bg-[var(--primary)] text-white"
                    : "bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                } +   break-words whitespace-pre-wrap`}
              >
                <ReactMarkdown>{msg.content}</ReactMarkdown>
              </div>
              {msg.role === "user" && (
                <User size={20} className="text-[var(--primary)] mt-1" />
              )}
            </div>
          ))
        )}
      </div>

      {/* Bottom Search Bar */}
      <div className="w-[80%] mx-auto flex mb-4">
        <input
          type="text"
          className="flex border rounded-full flex-1 mr-1 bg-gray-100 px-6 py-2 text-black "
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              sendMessage();
            }
          }}
        />
        <button
          className="min-w-8 aspect-square rounded bg-[var(--primary)] flex items-center justify-center p-2 cursor-pointer hover:scale-110 transition-transform duration-200 "
          onClick={sendMessage}
        >
          <Send size={20} className="text-white" />
        </button>
      </div>
    </div>
  );
};

export default ChatLeft;
