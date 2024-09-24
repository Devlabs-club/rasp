import mongoose, { Schema } from 'mongoose';

const messageSchema = new mongoose.Schema({
    sender: { 
        type: Schema.Types.ObjectId, 
        ref: 'User', required: true 
    },
    receiver: {
        type: Schema.Types.ObjectId,
        ref: 'User', required: true
    },
    content: { 
        type: String, 
        required: true 
    }, 
    timestamp: { 
        type: Date, 
        default: Date.now 
    }, 
    status: { 
        type: String,
        enum: ['sent', 'delivered', 'read'], 
        default: 'sent' 
    } 
});

const Message = mongoose.model("Message", messageSchema);

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

const Chat = mongoose.model("Chat", chatSchema);

export { Chat, Message };