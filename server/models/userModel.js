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
    photo: {
        type: Buffer
    },
    about: {
        age: {
            type: Number,
        },
        gender: {
            type: String,
        },
        location: {
            type: String,
        },
        bio: {
            type: String
        },
        projects: {
            type: Array
        },
        skills: {
            type: Array
        },
        experience: {
            type: Array
        },
        hobbies: {
            type: Array
        },
        socials: {
            type: Array
        }
    }    
});

export default mongoose.model("User", userSchema);