import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
    name: String,
    description: String,
    tools: [String],
    links: [String]
});

const experienceSchema = new mongoose.Schema({
    role: String,
    company: String,
    description: String,
    skills: [String]
});

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
    photo: Buffer,
    about: {
        dateOfBirth: Date,
        gender: String,
        campus: String,
        standing: String,
        major: String,
        skills: [String],
        projects: [projectSchema],        
        experience: [experienceSchema],
        hobbies: [String],
        socials: [String],
        bio: String
    },
    embedding: []
});

export default mongoose.model("User", userSchema);