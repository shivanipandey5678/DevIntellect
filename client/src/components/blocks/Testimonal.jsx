import { cn } from "@/lib/utils";
import { Marquee } from "@/components/magicui/marquee";




// Example reviews with Indian names and friendly comments
const reviews = [
  {
    name: "Rohit",
    username: "@rohit",
    body: "Pull in PDF, CSV, Website URL, YouTube transcript — let AI answer from all. Super helpful!",
    img: "https://avatar.vercel.sh/rohit",
  },
  {
    name: "Priya",
    username: "@priya",
    body: "Amazing! I can ask AI questions directly from any source. Love it!",
    img: "https://avatar.vercel.sh/priya",
  },
  {
    name: "Ankit",
    username: "@ankit",
    body: "This is next level. AI fetching answers from all types of content is so cool!",
    img: "https://avatar.vercel.sh/ankit",
  },
  {
    name: "Sneha",
    username: "@sneha",
    body: "I tried it with my PDF documents and it worked perfectly. Highly recommend!",
    img: "https://avatar.vercel.sh/sneha",
  },
  {
    name: "Vikram",
    username: "@vikram",
    body: "Pull in CSV and website URLs seamlessly. AI makes life easier!",
    img: "https://avatar.vercel.sh/vikram",
  },
  {
    name: "Meera",
    username: "@meera",
    body: "YouTube transcripts are now searchable with AI. Incredible feature!",
    img: "https://avatar.vercel.sh/meera",
  },
];

const firstRow = reviews.slice(0, reviews.length / 2);
const secondRow = reviews.slice(reviews.length / 2);

const ReviewCard = ({ img, name, username, body }) => {
  return (
    <figure
      className={cn(
        "relative h-full w-64 cursor-pointer overflow-hidden rounded-xl border p-4",
        "border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]",
        "dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]"
      )}
    >
      <div className="flex flex-row items-center gap-2">
        <img className="rounded-full" width="32" height="32" alt="" src={img} />
        <div className="flex flex-col">
          <figcaption className="text-sm font-medium dark:text-white">{name}</figcaption>
          <p className="text-xs font-medium dark:text-white/40">{username}</p>
        </div>
      </div>
      <blockquote className="mt-2 text-sm">{body}</blockquote>
    </figure>
  );
};

export function MarqueeDemo() {
  return (
    <div className="relative flex w-full flex-col items-center justify-center overflow-hidden">
      <Marquee pauseOnHover className="[--duration:20s]">
        {firstRow.map((review) => (
          <ReviewCard key={review.username} {...review} />
        ))}
      </Marquee>
      <Marquee reverse pauseOnHover className="[--duration:20s]">
        {secondRow.map((review) => (
          <ReviewCard key={review.username} {...review} />
        ))}
      </Marquee>

      {/* Gradient overlay to fade edges */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-background"></div>
      <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-background"></div>
    </div>
  );
}
