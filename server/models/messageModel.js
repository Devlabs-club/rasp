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

export default mongoose.model("Message", messageSchema);