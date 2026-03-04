import { PineconeStore } from "@langchain/pinecone";
import pinecone from "./pinecone.js";
import { nomicEmbeddings } from "./storeVectors.js";

export const similaritySearch = async (searchQuery, organizationId) => {
  const index = pinecone.index("rag-datasets");

  // #6 — Standardized namespace to organizationId || undefined
  const vectorStorage = new PineconeStore(nomicEmbeddings, {
    pineconeIndex: index,
    textKey: "text",
    namespace: organizationId || undefined,
  });

  const docs = await vectorStorage.similaritySearch(searchQuery, 3);
  return docs.map((doc) => doc.pageContent).join("\n\n");
};
