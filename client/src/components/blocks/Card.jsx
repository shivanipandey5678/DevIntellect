import React from "react";

const Card = ({ img, heading, para, tags }) => {
  return (
    <div className="bg-card text-card-foreground shadow-sm rounded-lg p-6 hover:shadow-md transition">
      {/* Icon + Heading */}
      <div className="flex items-center gap-3 mb-4">
        <span className="text-2xl">{img}</span>
        <h3 className="font-semibold text-xl">{heading}</h3>
      </div>

      {/* Paragraph */}
      <p className="text-muted-foreground mb-4">{para}</p>

      {/* Tags */}
      <div className="flex gap-2 flex-wrap">
        {tags.map((tag, i) => (
          <span
            key={i}
            className="nline-flex items-center px-2 py-1 rounded-md text-xs font-medium
                 bg-[var(--primary)] text-white dark:text-black"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
};

export default Card;
