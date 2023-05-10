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
        type: Date,
        required: false,
    },
    city: {
        type: String,
        required: false,
    },
    university: {
        type: String,
        required: false,
    },
    avatarUrl: String,
    friends: {
        type: [mongoose.Schema.Types.ObjectId],
        default: [],
    },
}, {
    timestamps: true,
});

export default mongoose.model('User', UserSchema);

