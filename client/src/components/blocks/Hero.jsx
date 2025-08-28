
import { Button } from "@/components/ui/button";
import { useState, useEffect, useRef } from "react";
import { AnimatedBeam } from "@/components/magicui/animated-beam";

import FileCsvSolidFullDark from "@/assets/file-csv-solid-full-dark.svg";
import FileCsvSolidFullLight from "@/assets/file-csv-solid-full-light.svg";
import FilePdfRegularFullDark from "@/assets/file-pdf-regular-full-dark.svg";
import FilePdfRegularFullWhite from "@/assets/file-pdf-regular-full-white.svg";
import FileRegularFullDark from "@/assets/file-regular-full-dark.svg";
import FileSvg from "@/assets/file.svg";
import GlobeSolidFullDark from "@/assets/globe-solid-full-dark.svg";
import GlobeSolidFullWhite from "@/assets/globe-solid-full-white.svg";
import YoutubeBrandsSolidFullDark from "@/assets/youtube-brands-solid-full-dark.svg";
import YoutubeBrandsSolidFullLight from "@/assets/youtube-brands-solid-full-light.svg";

import ChatGPTDark from "@/assets/chatgpt-dark.png";
import ChatGPTLight from "@/assets/chatgpt-white.png";
import UserDark from "@/assets/user-solid-full-real-white.svg";
import UserLight from "@/assets/user-solid-full-white.svg";

import { AnimatedGradientText } from "@/components/magicui/animated-gradient-text";
import { useNavigate } from "react-router-dom"

// Dynamic icons array
const ICONS = [
  {
    darkSrc: GlobeSolidFullDark,
    lightSrc: GlobeSolidFullWhite,
    alt: "internet",
  },
  {
    darkSrc: FileRegularFullDark,  // Google Docs (generic file)
    lightSrc: FileSvg,
    alt: "Google Docs",
  },
  {
    darkSrc: FileCsvSolidFullDark,
    lightSrc: FileCsvSolidFullLight,
    alt: "CSV File",
  },
  {
    darkSrc: FilePdfRegularFullDark,
    lightSrc: FilePdfRegularFullWhite,
    alt: "PDF File",
  },
  {
    darkSrc: YoutubeBrandsSolidFullDark,
    lightSrc: YoutubeBrandsSolidFullLight,
    alt: "YouTube",
  }
];

const Hero1 = ({
  badge = "✨ AI Data Ingestion",
  heading = "Universal Knowledge Flow",
  description = "Pull in PDF, CSV, Website URL, Youtube transcript — let AI answer from all.",
  buttons = {
    primary: { text: "Start Now", url: "#" },
    secondary: { text: "Learn More", url: "#" },
  },
}) => {
  const [isDark, setIsDark] = useState(false);
  const containerRef = useRef(null);
  const centerRef = useRef(null);
  const userRef = useRef(null);
  const iconRefs = ICONS.map(() => useRef(null));
  const navigate = useNavigate();

  useEffect(() => {
    const matchDark = window.matchMedia("(prefers-color-scheme: dark)");
    setIsDark(matchDark.matches);

    const handler = (e) => setIsDark(e.matches);
    matchDark.addEventListener("change", handler);
    return () => matchDark.removeEventListener("change", handler);
  }, []);

  return (
    <section className="py-15" id="about">
      <div className="container">
        <div className="grid items-center gap-8 lg:grid-cols-2">
          {/* Left Content */}
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left">

            <h1 className="my-6 text-pretty text-4xl font-bold lg:text-6xl"><AnimatedGradientText>{heading}</AnimatedGradientText></h1>
            <p className="text-muted-foreground mb-8 max-w-xl lg:text-xl">{description}</p>
            <div className="flex w-full flex-col justify-center gap-2 sm:flex-row lg:justify-start">
              {buttons.primary && (
                <Button onClick={() => navigate('/chat')}>

                  <a href={buttons.primary.url}>{buttons.primary.text}</a>
                </Button>
              )}
              {buttons.secondary && (
                <Button asChild variant="outline" className='dark:text-white dark:border-white'>
                  <a href={buttons.secondary.url}>{buttons.secondary.text}</a>
                  
                </Button>
              )}
            </div>
          </div>

          {/* Right Visualization */}
          <div ref={containerRef} className="relative flex h-[400px] w-full items-center justify-center overflow-hidden bg-background mb-10">
            {/* Source icons left-aligned vertically */}
            <div className="absolute left-8 top-1/2 flex flex-col gap-7 -translate-y-1/2">
              {ICONS.map((icon, i) => (
                <div key={i} ref={iconRefs[i]} className="h-12 w-12 rounded-full bg-white flex items-center justify-center shadow">
                  <img src={isDark ? icon.darkSrc : icon.lightSrc} alt={icon.alt} className="h-8 w-8" />
                </div>
              ))}
            </div>

            {/* Center Node (OpenAI/ChatGPT logo) */}
            <div ref={centerRef} className="h-20 w-20 rounded-full flex items-center justify-center bg-white shadow z-10">
              <img
                src={isDark ? ChatGPTDark : ChatGPTLight}
                alt="AI Node"
                className="h-14 w-14 rounded-full"
              />
            </div>

            {/* User Node (right) */}
            <div ref={userRef} className="absolute right-10 top-1/2 flex items-center justify-center h-12 w-12 rounded-full bg-white shadow" style={{ transform: "translateY(-50%)" }}>
              <img
                src={isDark ? UserDark : UserLight}
                alt="User"
                className="h-7 w-7"
              />
            </div>

            {/* Beams: sources to AI */}
            {ICONS.map((_, i) => (
              <AnimatedBeam
                key={`src-${i}`}
                containerRef={containerRef}
                fromRef={iconRefs[i]}
                toRef={centerRef}
              />
            ))}

            {/* Beam: AI to User */}
            <AnimatedBeam
              containerRef={containerRef}
              fromRef={centerRef}
              toRef={userRef}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export { Hero1 };
