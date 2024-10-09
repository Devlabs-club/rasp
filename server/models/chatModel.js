import mongoose, { Schema } from 'mongoose';

const chatSchema = new Schema({
    users: [
        { 
            type: Schema.Types.ObjectId, 
            ref: 'User', 
            required: true 
        }
    ],
    messages: [
        { 
            type: Schema.Types.ObjectId, 
            ref: 'Message' 
        }
    ],
    isGroupChat: {
        type: Boolean, 
        default: false 
    },
    groupName: { 
        type: String, 
        required: function() { return this.isGroupChat; } 
    },
    admin: { 
        type: Schema.Types.ObjectId, 
        ref: 'User',
        required: function() { return this.isGroupChat; }
    },
    pendingApprovals: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    lastMessage: { 
        messageId: { type: Schema.Types.ObjectId, ref: 'Message' },
        content: String,
        timestamp: Date,
        senderName: String,
        senderId: { type: Schema.Types.ObjectId, ref: 'User' }
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    },
    unreadMessages: [
        {
            user: { type: Schema.Types.ObjectId, ref: 'User' },
            count: { type: Number, default: 0 }
        }
    ],
});

export default mongoose.model("Chat", chatSchema);