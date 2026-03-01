import { PineconeStore } from "@langchain/pinecone";
import pinecone from "./pinecone.js";
import e from "express";
import { nomicEmbeddings } from "./storeVectors.js";

export const similaritySearch = async (searchQuery) => {
  const index = pinecone.index("rag-datasets");

  const vectorStorage = new PineconeStore(nomicEmbeddings, {
    pineconeIndex: index,
    textKey: "text",
  });

  const docs = await vectorStorage.similaritySearch(searchQuery , 3);
  console.log(docs)
  return docs.map((doc) => doc.pageContent).join("\n\n");
};
