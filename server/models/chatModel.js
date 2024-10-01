import mongoose, { Schema } from 'mongoose';

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
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Chat", chatSchema);