import { GoogleGenerativeAI } from "@google/generative-ai";
import functionDeclarations from "../utils/chatFunctionDeclarations.js";
import User from "../models/userModel.js";
import getEmbedding from "../utils/getEmbedding.js"
import dotenv from "dotenv";
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Model
const generativeModel = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",

  tools: {
    functionDeclarations,
  },
  generationConfig: {
    temperature: 1
  }
});

const chat = generativeModel.startChat({
  history: [{
      role: "user",
      parts: [{ 
        text: 
          `You are Invenire, an AI RAG assistant that uses function calling to select users from a given subset when prompted with a query.` 
      }],
    }]
});

// Functions
const functions = {
  selectUsers: async ({ userGoogleIds }) => {
    return userGoogleIds;
  },
}

const saveUser = async (req, res, next) => {
  try {
    const userData = req.body.user;
    const user = await User.findOne({ googleId: userData.googleId });
    user.about = { ...userData.about };

    const data = `
        ${userData.about.age} year old ${userData.about.gender} from ${userData.about.location}.\n
        Bio: ${userData.about.bio}\n
        Projects: ${userData.about.projects} \n
        Skills: ${userData.about.skills} \n
        Experience: ${userData.about.experience} \n
        Hobbies: ${userData.about.hobbies} \n
        Socials: ${userData.about.socials} \n

    `;
    const embedding = await getEmbedding(data);
    user.embedding = embedding;
    user.save();

    res
        .status(201)
        .json({ message: "User data has been saved" });
    next();    
  } 
  catch (error) {
    console.error(error);
  }
}

const selectUsers = async (query, userSubset) => {
  const result = await chat.sendMessage(`Use function calling to select users from this subset: ${userSubset}\n\nQuery: ${query}`);

  const call = result.response.functionCalls() ? result.response.functionCalls()[0] : null;

  if (call) {
    const userGoogleIds = functions[call.name](call.args);
    const users = []

    for (const userGoogleId of userGoogleIds) {
      const user = await User.findOne({ googleId: userGoogleId });
      users.push(user);
    }

    return users;
  }
}

const searchUser = async (req, res, next) => {
  const agg = [
      {
          "$vectorSearch": {
          "index": "vector_index",
          "limit": 3,
          "numCandidates": 5,
          "path": "embedding",
          "queryVector": await getEmbedding(req.body.query)
          }
      },
      {
        '$project': {
            '_id': 0, 
            'name': 1, 
            'email': 1,
            'about': 1,
            'score': {
              '$meta': 'vectorSearchScore'
            }
        }
      }
  ];
  // run pipeline
  const userSubset = await User.aggregate(agg);

  const users = await selectUsers(req.body.query, userSubset);
  
  // print results
  res.json(users);
}

export { saveUser, searchUser };