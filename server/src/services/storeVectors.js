import pinecone from "./pinecone.js";
import { NomicEmbeddings } from "@langchain/nomic";

export const nomicEmbeddings = new NomicEmbeddings({
  apiKey: process.env.NOMIC_API_KEY,
  model: "nomic-embed-text-v1",
});

const index = pinecone.index("rag-datasets");

export async function storeChunkInPinecone(chunks, organizationId) {
  try {
    if (!chunks?.length) return;

    const vectors = [];

    for (let i = 0; i < chunks.length; i++) {
        const chunk = chunks[i];

        const embedding = await nomicEmbeddings.embedQuery(chunk);
        
        const uniqueId = `rag-datasets-${Date.now()}-${Math.random().toString(36).substring(7)}-${i}`;

        vectors.push({
            id: uniqueId,
            values: embedding,
            metadata: {
                text: chunk,
                chunkIndex: i,
            },
         });
    }

    // #6 — Standardized namespace handling
    if (organizationId) {
       await index.namespace(organizationId).upsert(vectors);
    } else {
       await index.upsert(vectors);
    }
    
  } catch (error) {
    console.error("Store vectors error:", error);
    throw error;
  }
}
