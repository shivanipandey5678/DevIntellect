import dotenv from "dotenv";
dotenv.config({ path: "../.env" });

import fetch from "node-fetch";

const QDRANT_URL = process.env.QDRANT_URL;
const QDRANT_API_KEY = process.env.QDRANT_API_KEY;

async function resetQdrant() {
  const res = await fetch(`${QDRANT_URL}/collections`, {
    headers: {
      "api-key": QDRANT_API_KEY,
      "Content-Type": "application/json",
    },
  });
  const data = await res.json();

  if (!data.result || !data.result.collections) {
    console.error("❌ No collections found in Qdrant response:", data);
    return;
  }

  for (const c of data.result.collections) {
    console.log(`🗑️ Deleting ${c.name}`);
    await fetch(`${QDRANT_URL}/collections/${c.name}`, {
      method: "DELETE",
      headers: {
        "api-key": QDRANT_API_KEY,
        "Content-Type": "application/json",
      },
    });
  }

  console.log("✅ All collections deleted");
}

resetQdrant();














// import dotenv from 'dotenv';
// dotenv.config({path:'../.env'})

// import fetch from "node-fetch";
// console.log("🧠🧠🧠🧠🧠🧠🧠",process.env.QDRANT_URL)
// const QDRANT_URL = process.env.QDRANT_URL;

// async function resetQdrant() {
//   const res = await fetch(${QDRANT_URL}/collections);
//   const data = await res.json();
  
//   for (const c of data.result.universalCollection) {
//     console.log(`🗑️ Deleting ${c.name}`);
//     await fetch(`${QDRANT_URL}/universalCollection/${c.name}`, { method: "DELETE" });
//   }
//   console.log("✅ All collections deleted");
// }

// resetQdrant();
