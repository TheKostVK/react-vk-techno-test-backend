import bcrypt from "bcrypt";
import UserModel from "../models/User.js";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
    try {
        const password = req.body.password;
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        const doc = new UserModel({
            email: req.body.email.toLowerCase(),
            userName: req.body.userName,
            passwordHash: hash,
            avatarUrl: req.body.avatarUrl,
            wasBorn: req.body.wasBorn,
            city: req.body.city,
            university: req.body.university,
        });

        const user = await doc.save();

        const token = jwt.sign(
            {
                _id: user._id,
            },
            'secret123',
            {
                expiresIn: '30d',
            },
        );

        const {passwordHash, ...userData} = user._doc;

        res.json({
            ...userData,
            token,
        });
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Не удалось зарегистрировать пользователя',
        });
    }
};

export const login = async (req, res) => {
    try {
        const user = await UserModel.findOne({email: req.body.email.toLowerCase()});

        if (!user) {
            return res.status(404).json({
                message: 'Некорректные данные для авторизации'
            });
        }

        const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash);

        if (!isValidPass) {
            return res.status(400).json({
                message: 'Некорректные данные для авторизации'
            });
        }

        const token = jwt.sign(
            {
                _id: user._id,
            },
            'secret123',
            {
                expiresIn: '30d',
            },
        );

        const {passwordHash, ...userData} = user._doc;

        res.json({
            ...userData,
            token,
        });

    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Не удалось авторизовать пользователя',
        });
    }
};

export const getMe = async (req, res) => {
    try {
        const user = await UserModel.findById(req.userId);
        if (!user) {
            return res.status(404).json({
                message: 'Пользователь не найден'
            });
        }

        const {passwordHash, ...userData} = user._doc;

        res.json(userData);
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Отказано в доступе',
        });
    }
};

export const getUserById = async (req, res) => {
    try {
        const user = await UserModel.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'Пользователь не найден' });
        }
        const { passwordHash, ...userData } = user._doc;
        res.json(userData);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Отказано в доступе' });
    }
};

export const addFriend = async (req, res) => {
    try {
        const { userId, friendId } = req.params;

        // Проверяем, что пользователь с таким id существует
        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'Пользователь не найден' });
        }

        // Проверяем, что пользователь, которого хотим добавить в друзья, существует
        const friend = await UserModel.findById(friendId);
        if (!friend) {
            return res.status(404).json({ message: 'Пользователь не найден' });
        }

        // Проверяем, что пользователь, которого хотим добавить в друзья, не является уже другом
        if (user.friends.includes(friendId)) {
            return res.status(400).json({ message: 'Пользователь уже является другом' });
        }

        // Добавляем пользователя в список друзей
        await UserModel.findByIdAndUpdate(userId, { $push: { friends: friendId } });

        res.json({ message: 'Пользователь успешно добавлен в друзья' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Не удалось добавить пользователя в друзья' });
    }
};

export const removeFriend = async (req, res) => {
    try {
        const { userId, friendId } = req.params;

        // Проверяем, что пользователь с таким id существует
        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'Пользователь не найден' });
        }

        // Проверяем, что пользователь, которого хотим удалить из друзей, существует
        const friend = await UserModel.findById(friendId);
        if (!friend) {
            return res.status(404).json({ message: 'Пользователь не найден' });
        }

        // Проверяем, что пользователь, которого хотим удалить из друзей, является другом
        if (!user.friends.includes(friendId)) {
            return res.status(400).json({ message: 'Пользователь не является другом' });
        }

        // Удаляем пользователя из списка друзей
        await UserModel.findByIdAndUpdate(userId, { $pull: { friends: friendId } });

        res.json({ message: 'Пользователь успешно удален из друзей' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Не удалось удалить пользователя из друзей' });
    }
};
