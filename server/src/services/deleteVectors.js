import pinecone from "./pinecone.js";

// Helper to delete all vectors in a given namespace
export const deleteVectorsByNamespace = async (namespace) => {
  try {
    if (!namespace) return;
    const index = pinecone.index("rag-datasets");
    await index.namespace(namespace).deleteAll();
  } catch (error) {
    console.error("Delete vectors error:", error);
    throw error;
  }
};
