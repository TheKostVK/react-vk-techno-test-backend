import mongoose from "mongoose";

const PostSchema = new mongoose.Schema({
        title: {
            type: String,
            required: false,
        },
        text: {
            type: String,
            required: true,
        },
        tags: {
            type: Array,
            default: [],
        },
        imageUrl: {
            type: Array,
            default: [],
        },
        viewsCount: {
            type: Number,
            default: 1,

        },
        likesCount: {
            type: Number,
            default: 0,
        },
        likes: {
            type: Array,
            ref: 'User'
        },
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

export default mongoose.model('Post', PostSchema);
