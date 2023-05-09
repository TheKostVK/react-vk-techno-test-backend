import PostModel from '../models/Post.js';

export const getLastTags = async (req, res) => {
    try {

        const posts = await PostModel.find().limit(5).exec();

        const tags = posts.map(obj => obj.tags).flat().slice(0, 5);

        res.json(tags);
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Не удалось получить теги',
        });
    }
};

export const getAll = async (req, res) => {
    try {
        const posts = await PostModel.find().populate('user').sort({createdAt: -1}).exec();

        res.json(posts);
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Не удалось получить статьи',
        });
    }
};

export const getPostOnPage = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.perPage) || 5;

    try {
        const totalPosts = await PostModel.countDocuments();

        const totalPages = Math.ceil(totalPosts / perPage);

        const offset = (page - 1) * perPage;
        const posts = await PostModel.find()
            .populate('user')
            .sort({createdAt: -1})
            .skip(offset)
            .limit(Math.min(perPage, totalPosts - offset));

        res.json({
            posts,
            pageInfo: {
                page,
                perPage,
                totalPages,
                totalPosts,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Не удалось получить статьи',
        });
    }
};


export const getAllByAuthor = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.perPage) || 5;
    const {userId} = req.params;

    try {
        const totalPosts = await PostModel.countDocuments();

        const totalPages = Math.ceil(totalPosts / perPage);

        const offset = (page - 1) * perPage;
        const posts = await PostModel.find({user: userId})
            .populate('user')
            .sort({createdAt: -1})
            .skip(offset)
            .limit(Math.min(perPage, totalPosts - offset));

        res.json({
            posts,
            pageInfo: {
                page,
                perPage,
                totalPages,
                totalPosts,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Не удалось получить статьи',
        });
    }
};


export const getOne = async (req, res) => {
    try {
        const postId = req.params.id;

        const post = await PostModel.findOneAndUpdate(
            {
                _id: postId,
            },
            {
                $inc: {viewsCount: 1},
            },
            {
                returnDocument: 'after',
            }
        ).populate('user').exec();

        if (!post) {
            return res.status(404).json({
                message: 'Статья не найдена',
            });
        }

        res.json(post);
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Не удалось получить статью',
        });
    }
};

export const addLike = async (req, res) => {
    try {
        const postId = req.params.id;

        const post = await PostModel.findOneAndUpdate(
            {
                _id: postId,
            },
            {
                $inc: {likesCount: 1},
            },
            {
                new: true,
            }
        ).populate('user').exec();

        if (!post) {
            return res.status(404).json({
                message: 'Статья не найдена',
            });
        }

        res.json(post);
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Не удалось обновить статью',
        });
    }
};

export const removeLike = async (req, res) => {
    try {
        const postId = req.params.id;

        const post = await PostModel.findOneAndUpdate(
            {
                _id: postId,
            },
            {
                $inc: {likesCount: -1},
            },
            {
                new: true,
            }
        ).populate('user').exec();

        if (!post) {
            return res.status(404).json({
                message: 'Статья не найдена',
            });
        }

        res.json(post);
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Не удалось обновить статью',
        });
    }
};


export const create = async (req, res) => {
    try {
        const doc = new PostModel({
            title: req.body.title,
            text: req.body.text,
            imageUrl: req.body.imageUrl,
            tags: req.body.tags,
            user: req.userId,
        });

        const post = await doc.save();

        const updatedPost = await PostModel.findById(post._id).populate('user', 'avatarUrl userName');

        res.json(updatedPost);
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Не удалось создать статью',
        });
    }
};

export const remove = async (req, res) => {
    try {
        const postId = req.params.id;

        const post = await PostModel.findOneAndDelete(
            {
                _id: postId,
            });

        if (!post) {
            return res.status(404).json({
                message: 'Статья не найдена',
            });
        }

        res.json({
            success: true,
        });
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Не удалось удалить статью',
        });
    }
};

export const update = async (req, res) => {
    try {
        const postId = req.params.id;

        await PostModel.updateOne({
                _id: postId,
            },
            {
                title: req.body.title,
                text: req.body.text,
                imageUrl: req.body.imageUrl,
                user: req.userId,
                tags: req.body.tags,
            },
        );
        res.json({
            success: true,
        });
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Не удалось обновить статью',
        });
    }
};
