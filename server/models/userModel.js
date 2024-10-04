import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    googleId: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    photo: String,
    about: {
        dateOfBirth: Date,
        gender: String,
        campus: String,
        standing: String,
        major: String,
        skills: [String],
        hobbies: [String],
        socials: [String],
        bio: String,
    },
    embedding: []
});

const User = mongoose.model("User", userSchema);

const statusSchema = new mongoose.Schema({
    content: String,
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', required: true 
    },
    expirationDate: {
        type: Date,
        required: true
    }
});
// Create the TTL index
statusSchema.index({ expirationDate: 1 }, { expireAfterSeconds: 0 });

const Status = mongoose.model("Status", statusSchema);

export { User, Status };