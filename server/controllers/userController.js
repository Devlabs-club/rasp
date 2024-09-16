import User from "../models/userModel.js";
import { getDataEmbedding, getQueryEmbedding } from "../utils/getEmbedding.js";
import dotenv from "dotenv";
dotenv.config();

const saveUser = async (req, res, next) => {
  try {
    const userData = req.body.user;
    const user = await User.findOne({ googleId: userData.googleId });
    user.about = { ...userData.about };
    user.embedding = await getDataEmbedding([JSON.stringify(userData.about)]);
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

const searchUser = async (req, res, next) => {
  const agg = [
    {
      '$vectorSearch': {
        'index': 'vector_index',
        'path': 'embedding',
        'queryVector': await getQueryEmbedding(req.body.query), // Adjust the query vector as needed
        'numCandidates': 6,
        'limit': 1
      }
    },
    {
      '$project': {
        '_id': 0,
        'email': 1,
        'name': 1,
        'about': 1,
        'score': {
          '$meta': 'vectorSearchScore'
        }
      }
    }
  ];
  const result = await User.aggregate(agg);
  res.json(result);
}

export { saveUser, searchUser };