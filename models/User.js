import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
        userName: {
            type: String,
            required: true,
            unique: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        passwordHash: {
            type: String,
            required: true,
        },
        wasBorn: {
            type: String,
            required: true,
        },
        city: {
            type: String,
            required: true,
        },
        university: {
            type: String,
            required: true,
        },
        avatarUrl: String,
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model('User',UserSchema);