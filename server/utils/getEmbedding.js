import { HuggingFaceTransformersEmbeddings } from "@langchain/community/embeddings/hf_transformers";

const model = new HuggingFaceTransformersEmbeddings();

const getDataEmbedding = async (data) => {
  const response = await model.embedDocuments(data);
  return Array.from(response.data);
}

const getQueryEmbedding = async (query) => {
  const response = await model.embedQuery(query);
  return Array.from(response.data);
}

export { getDataEmbedding, getQueryEmbedding };