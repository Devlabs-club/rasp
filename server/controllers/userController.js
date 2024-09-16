import User from "../models/userModel.js";
import { MongoDBAtlasVectorSearch } from "@langchain/mongodb";
import { HuggingFaceTransformersEmbeddings } from "@langchain/community/embeddings/hf_transformers";
import dotenv from "dotenv";
dotenv.config();

const vectorStore = new MongoDBAtlasVectorSearch(new HuggingFaceTransformersEmbeddings({
    model: 'mixedbread-ai/mxbai-embed-large-v1',
  }), {
  collection: User.db.collection("users"), 
  indexName: "vector_index", 
  textKey: "about", 
  embeddingKey: "embedding",
});

const saveUser = async (req, res, next) => {
  try {
    const userData = req.body.user;
    const user = await User.findOne({ googleId: userData.googleId });
    user.about = { ...userData.about };
    user.save();

    vectorStore.addDocuments([{ pageContent: "", metadata: userData.about }]);
    
    res
        .status(201)
        .json({ message: "User data has been saved" });
    next();    
  } 
  catch (error) {
    console.error(error);
  }
}

const searchUser = async (req, res, next) => {
  const result = await vectorStore.similaritySearch(req.body.query, 1);
  console.log(result);
  res.json(result);
}

export { saveUser, searchUser };