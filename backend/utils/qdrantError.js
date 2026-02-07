/**
 * Returns a user-friendly message when the error is due to Qdrant not running or unreachable.
 */
export function getQdrantFriendlyMessage(error) {
  const msg = error?.message || "";
  const code = error?.cause?.code || error?.code;
  if (
    code === "ECONNREFUSED" ||
    msg.includes("fetch failed") ||
    msg.includes("ECONNREFUSED") ||
    msg.includes("Unable to check client-server compatibility")
  ) {
    return "Vector DB (Qdrant) is not running or unreachable. Start Qdrant (e.g. docker run -p 6333:6333 qdrant/qdrant) and check QDRANT_URL in backend/.env";
  }
  return msg || String(error);
}
