import mongoose, { Schema } from 'mongoose';
import Message from "./messageModel.js";

const chatSchema = new Schema({
    users: [
        { 
            type: Schema.Types.ObjectId, 
            ref: 'User', required: true 
        }
    ],
    messages: [
        { 
            type: Schema.Types.ObjectId, 
            ref: 'Message' 
        }
    ],
    createdAt: { type: Date, default: Date.now }, // When the chat was created
});

export default mongoose.model("Chat", chatSchema);