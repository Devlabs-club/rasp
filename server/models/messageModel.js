import mongoose, { Schema } from 'mongoose';

const messageSchema = new mongoose.Schema({
    sender: { 
        type: Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    chat: {
        type: Schema.Types.ObjectId,
        ref: 'Chat', 
        required: true
    },
    content: { 
        type: String, 
        required: true 
    }, 
    timestamp: { 
        type: Date, 
        default: Date.now 
    },
    readBy: [{ 
        type: Schema.Types.ObjectId, 
        ref: 'User' 
    }]
});

export default mongoose.model("Message", messageSchema);