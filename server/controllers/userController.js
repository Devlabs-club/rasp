import User from "../models/userModel.js";
import { MongoDBAtlasVectorSearch } from "@langchain/mongodb";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HuggingFaceTransformersEmbeddings } from "@langchain/community/embeddings/hf_transformers";
import { Document } from "@langchain/core/documents";
import dotenv from "dotenv";
dotenv.config();

const embeddings = new HuggingFaceTransformersEmbeddings({
  model: "mixedbread-ai/mxbai-embed-large-v1"
});
const vectorStore = new MongoDBAtlasVectorSearch(
  embeddings,
  {
    collection: User.db.collection("users"), 
    indexName: "vector_index", // The name of the Atlas search index. Defaults to "default"
    textKey: "summary", // The name of the collection field containing the raw content. Defaults to "text"
    embeddingKey: "embedding", // The name of the collection field containing the embedded text. Defaults to "embedding"
  }
);

const saveUser = async (req, res, next) => {
  try {
    const userData = req.body.user;
    const user = await User.findOne({ googleId: userData.googleId });
    user.name = userData.name;
    user.about = { ...userData.about };
    user.save();

    await vectorStore.addDocuments([new Document(
      { 
        pageContent: `
          ${userData.about.gender} from ASU ${userData.about.campus} campus.\n
          Bio: ${userData.about.bio} \n
          Skills: ${userData.about.skills.join(", ")} \n
          Hobbies: ${userData.about.hobbies.join(", ")} \n
          Socials: ${userData.about.socials.join(", ")} \n
          Projects: ${userData.about.projects} \n
          Experience: ${userData.about.experience} \n
        `, 
        metadata: {age: userData.age, gender: userData.gender, location: userData.location} 
      }
    )
      ,
    ], { ids: [user._id] });
    
    res
        .status(201)
        .json({ message: "User data has been saved" });
    next();    
  } 
  catch (error) {
    console.error(error);
  }
}

const llm = new ChatGoogleGenerativeAI({
  model: "gemini-1.5-flash",
  temperature: 0,
  apiKey: process.env.GEMINI_API_KEY,
});

const searchUser = async (req, res, next) => {
  const retrievedDocs = await vectorStore.similaritySearch(req.body.query, 5);

  const prompt = `
    Query: ${req.body.query}
    Context: ${JSON.stringify(retrievedDocs.filter(doc => doc.metadata.email !== req.body.user.email))}
    Array:
  `;
  const retrievedUsers = JSON.parse((await llm.invoke([
    [
      "system",
      `You're an assistant that returns an array of objects in the format 
      {googleId: <userGoogleId>, relevantInfo: <infoRelevantToQuery>} based on a query.
      It is very important that you only include users DIRECTLY relevant to the query, don't stretch the meaning of the query too far. 
      For relevantInformation, generate only detailed information that is directly relevant to the query (max 10 words) in god-perspective.
      Use the following pieces of retrieved context. If there are no matches, just return an empty array [].
      Return only an array and NOTHING ELSE no matter what.`,
    ],
    ["human", prompt],
  ])).content);
  
  const users = [];
  for (const retrievedUser of retrievedUsers) {
    const user = (await User.findOne({ googleId: retrievedUser.googleId }))._doc;
    users.push({...user, relevantInfo: retrievedUser.relevantInfo});
  }

  res.json(users);
}

export { saveUser, searchUser };