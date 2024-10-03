import mongoose from "mongoose";

// const projectSchema = new mongoose.Schema({
//     name: String,
//     description: String,
//     tools: [String],
//     links: [String]
// });

// const experienceSchema = new mongoose.Schema({
//     role: String,
//     company: String,
//     description: String,
//     skills: [String]
// });

const statusSchema = new mongoose.Schema({
    content: String,
    expirationDate: {
        type: Date,
        required: true
    }
});

// Create the TTL index
statusSchema.index({ expirationDate: 1 }, { expireAfterSeconds: 0 });

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
        status: statusSchema
    },
    embedding: []
});

export default mongoose.model("User", userSchema);