import User from "../models/userModel.js";
import { google } from "googleapis";
import { Message } from "../models/chatModel.js";
import dotenv from "dotenv";
dotenv.config();

const oAuth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  'http://localhost:3000',
);

const userVerification = async (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.json({ status: false });
  }

  try {
    const googleUser = await oAuth2Client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const user = await User.findOne({ email: googleUser.payload.email });
    if (user) {
      const receivedMessages = await Message.find({ receiver: user._id, status: "sent" });
      for (const message of receivedMessages) {
        message.status = "delivered";
        message.save();
      }

      return res.json({ status: true, user: { ...user._doc } });
    }
    else {
      return res.json({ status: false });
    }
  } 
  catch (err) {
    console.log(err);
    return res.json({ status: false });
  }
}

export { userVerification };