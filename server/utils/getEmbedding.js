import { HuggingFaceTransformersEmbeddings } from "@langchain/community/embeddings/hf_transformers";

const model = new HuggingFaceTransformersEmbeddings({
    model: 'mixedbread-ai/mxbai-embed-large-v1',
});

const getDataEmbedding = async (data) => {
  const response = await model.embedDocuments(data);
  return response[0];
}

const getQueryEmbedding = async (query) => {
  const response = await model.embedQuery(query);
  return response;
}

export { getDataEmbedding, getQueryEmbedding };