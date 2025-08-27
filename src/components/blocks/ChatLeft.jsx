import React from 'react';
import { Send,User,Bot } from "lucide-react";
import { AnimatedThemeToggler } from "@/components/magicui/animated-theme-toggler"
import { AnimatedShinyText } from "@/components/magicui/animated-shiny-text";
import { AnimatedGradientText } from "@/components/magicui/animated-gradient-text";

const ChatLeft = () => {
    const messages = [
        { role: "user", content: "Hi there!" },
        { role: "ai", content: "Hello! How can I help you today?" },
        { role: "user", content: "Tell me a joke." },
        { role: "ai", content: "Sure! Why don’t skeletons fight each other? Because they don’t have the guts. 😄" },
      ];
    return (
        <div className="relative h-screen flex flex-col gap-4 h overflow-hidden">
            {/* Top Header */}
            <div className="sticky top-0 z-50 backdrop-blur-md w-full bg-gray-100 dark:bg-gray-900 px-6 py-6 border flex justify-between ">
                <div>              <AnimatedGradientText>Ask Anything...</AnimatedGradientText></div>
                <div className='flex gap-3'>
                   <AnimatedThemeToggler/>
                    <User size={24} className="text-gray-600" />
                </div>


            </div>

            {/* Middle Scrollable Content */}
            <div className="flex-1 w-[80%] mx-auto  overflow-auto pb-20">
             
            {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex items-start gap-2 ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {/* Icon on left/right */}
            {msg.role === "ai" && (
              <Bot size={20} className="text-[var(--primary)] mt-1" />
            )}
            <div
              className={`px-4 py-2 rounded-2xl max-w-[70%] ${
                msg.role === "user"
                  ? "bg-[var(--primary)] text-white"
                  : "bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              }`}
            >
              {msg.content}
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
                />
                <button className="min-w-8 aspect-square rounded bg-[var(--primary)] flex items-center justify-center p-2 cursor-pointer">
                    <Send size={20} className='text-white' />
                </button>
            </div>
        </div>
    );
};

export default ChatLeft;
