# DevIntellect

RAG (Retrieval-Augmented Generation) web app: upload documents, YouTube links, or website URLs, then chat with an AI that answers from your indexed content.

## Features

- **Website URL** – Enter any website link; content is fetched (Cheerio + Puppeteer fallback), chunked, embedded, and indexed. Chat over the page content.
- **YouTube** – Paste a YouTube link; transcript is loaded, embedded, and stored. Ask questions about the video.
- **File upload** – CSV, PDF, and TXT supported. Files are processed and added to the same vector store.
- **Chat** – Single chat interface that queries the shared vector store (Qdrant) and uses OpenAI for answers based on your context only.

## Tech Stack

| Layer   | Stack |
|--------|--------|
| Frontend | React 19, Vite, React Router, Tailwind CSS, Radix UI, Framer Motion |
| Backend  | Node.js, Express 5 |
| AI / RAG | LangChain (OpenAI embeddings), Qdrant (vector DB), OpenAI GPT-4o-mini |
| Website  | Cheerio + Puppeteer (for JS-rendered pages) |

## Prerequisites

- **Node.js** (v18+)
- **Qdrant** (local or cloud) – [qdrant.tech](https://qdrant.tech/)
- **OpenAI API key**

## Setup

### 1. Clone and install

```bash
git clone <repo-url>
cd DevIntellect
```

### 2. Backend

```bash
cd backend
npm install
```

Create `backend/.env`:

```env
OPENAI_API_KEY=your_openai_key
QDRANT_URL=http://localhost:6333
```

If Qdrant is local:

```bash
# Docker
docker run -p 6333:6333 qdrant/qdrant
```

### 3. Frontend

```bash
cd client
npm install
```

Optional: create `client/.env` if you use a different API base URL:

```env
VITE_API_BASE_URL=http://localhost:5000
```

(Currently the app uses `http://localhost:5000` for API calls.)

## Run

1. **Backend** (from `backend/`):

```bash
npm run dev
```

Runs on **http://localhost:5000**.

2. **Frontend** (from `client/`):

```bash
npm run dev
```

Runs on **http://localhost:5173**.

3. Open **http://localhost:5173** in the browser. Go to **Chat**, add context (website link, YouTube link, or file), then ask questions.

## API Endpoints

| Method | Endpoint           | Body / Type        | Description                |
|--------|--------------------|--------------------|----------------------------|
| POST   | `/api/chat`        | `{ message }`      | Send message, get AI reply |
| POST   | `/api/websitelink` | `{ websiteLnk }`   | Index a website URL        |
| POST   | `/api/youtubelink` | `{ youtubeLink }`  | Index a YouTube video      |
| POST   | `/api/load-csv`    | FormData, `CsvPath`| Upload CSV/PDF/TXT         |

All indexed data goes into the same Qdrant collection (`universalCollection`), so chat uses the combined context.

## Project Structure

```
DevIntellect/
├── client/                 # React + Vite frontend
│   ├── src/
│   │   ├── components/     # UI, blocks (ChatLeft, Chatright, SidebarTabHeader, etc.)
│   │   ├── context/        # AppContext (currentContext for sidebar)
│   │   ├── pages/          # Home, Chat
│   │   └── main.jsx
│   └── package.json
├── backend/                # Express API
│   ├── controllers/       # chatWithBot, websiteLinkUpload, youtubeLinkUpload, csvUpload
│   ├── Router/router.js
│   ├── config/
│   ├── index.js            # Entry point
│   └── package.json
└── README.md
```

## Notes

- **Website feature**: Uses Cheerio first (fast). If the page has no/empty content, it falls back to Puppeteer (headless Chrome) for JS-rendered sites. Ensure Puppeteer dependencies are installed if you use the fallback.
- **Chat**: Replies are based only on indexed context (your uploads + website + YouTube). If nothing is indexed, retrieval may return little context; the system prompt instructs the model to say it doesn’t have that context.
- **CORS**: Backend allows `http://localhost:5173`. For another frontend origin, update `cors` in `backend/index.js`.

## License

MIT (or as per your project).
