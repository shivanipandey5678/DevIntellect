
import React from 'react'
import { Dock, DockIcon } from "@/components/magicui/dock";
import { FaDiscord, FaLinkedin, FaGithub } from "react-icons/fa";

export default function SocialDock() {
  return (
    <Dock>
      <DockIcon>
        <a
          href="https://discord.gg/atEfq8Sb"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaDiscord size={24} />
        </a>
      </DockIcon>

      <DockIcon>
        <a
          href="https://www.linkedin.com/in/shivani-pandey-029600288/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaLinkedin size={24} />
        </a>
      </DockIcon>

      <DockIcon>
        <a
          href="https://github.com/shivanipandey5678"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaGithub size={24} />
        </a>
      </DockIcon>
    </Dock>
  );
}
