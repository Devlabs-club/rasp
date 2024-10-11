import { User } from "../models/userModel.js";
import { google } from "googleapis";
import { jwtDecode } from 'jwt-decode';
import dotenv from "dotenv";
dotenv.config();

const oAuth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.CLIENT_URL,
);

const googleAuth = async (req, res, next) => {
  try {
    const { tokens } = await oAuth2Client.getToken(req.body.code);
    oAuth2Client.setCredentials(tokens);
    const { name, email, sub, picture } = jwtDecode(tokens.id_token);

    let user = await User.findOne({ googleId: sub });
    if (!user) {
      user = await User.create({ name, email, googleId: sub, photo: picture });
    }

    console.log(tokens.id_token);
    
    res.cookie("token", tokens.id_token, {
      withCredentials: true,
      httpOnly: false,
      sameSite: "none",
    });

    res
        .status(201)
        .json({ message: "User signed in successfully", success: true });
    next();    
  } 
  catch (error) {
    console.error(error);
  }
}

export { googleAuth };