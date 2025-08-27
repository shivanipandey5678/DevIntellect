import React from "react";
import Card from "./Card";

const featuresData = [
  {
    img: "📄",
    heading: "Document Intelligence",
    para: "Upload your files (PDF, CSV, JSON) and instantly extract insights or ask questions directly from the content.",
    tags: ["PDF", "CSV", "JSON", "Smart Q&A"],
  },
  {
    img: "🎥",
    heading: "Video Q&A",
    para: "Paste a YouTube link and get answers to your questions based on the video’s content with AI-powered accuracy.",
    tags: ["YouTube", "Video Insights", "AI Q&A"],
  },
  {
    img: "🌐",
    heading: "Website Explorer",
    para: "Provide any website link, and our AI will fetch, analyze, and let you query the website in real-time.",
    tags: ["Web Scraping", "AI Model", "Fast Response"],
  },
  {
    img: "⚡",
    heading: "AI-Powered Assistance",
    para: "Using the latest OpenAI fast models, get quick, precise, and context-aware answers for your tasks.",
    tags: ["OpenAI", "Fast Models", "Smart Queries"],
  },
];

const Features = () => {
  return (
    <section className="py-12" id="Features">
      {/* Heading + Subheading */}
      <div className="text-center mb-12">
      <h1 className="scroll-m-20 text-center text-3xl font-extrabold tracking-tight text-balance py-2">
        Features 
    </h1>
        
        <p className="text-muted-foreground text-lg">
          Comprehensive solutions to bring your digital vision to life.
        </p>
      </div>

      {/* Cards grid */}
      <div className="grid gap-6 grid-cols-1 ">
        {featuresData.map((el, i) => (
          <Card key={i} {...el} />
        ))}
      </div>
    </section>
  );
};

export default Features;
