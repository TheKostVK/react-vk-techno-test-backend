import express from "express";
import mongoose from "mongoose";
import cors from 'cors';

import {loginValidation, registerValidation, postCreateValidation} from "./validations/index.js";
import {checkAuth, handleValidationErrors, } from './utils/index.js';
import {UserController, PostController, UploadController} from "./controllers/index.js"
import multer from 'multer';
import dotenv from 'dotenv';

dotenv.config();

mongoose.connect(process.env.REACT_APP_API_DB_URL).then(() => console.log('DB ok')).catch((err) => console.log('DB error', err));

const app = express();

app.use(cors());

app.use(express.json());


// Загрузчик файла с настройками хранения
const upload = multer();

app.post('/upload', cors(), upload.single('image'), UploadController.uploadDBX);

// app.use('/media', express.static('media'));

// user
app.post('/auth/login', cors(), loginValidation, handleValidationErrors, UserController.login);
app.post('/auth/registration', cors(), registerValidation, handleValidationErrors, UserController.register);
app.get('/auth/me', cors(), checkAuth, UserController.getMe)

// posts
app.get('/posts', cors(), PostController.getAll);
app.get('/posts/:id', cors(), PostController.getOne);
app.post('/posts', cors(), checkAuth, postCreateValidation, handleValidationErrors, PostController.create);
app.delete('/posts/:id', cors(), checkAuth, PostController.remove);
app.patch('/posts/:id', cors(), checkAuth, postCreateValidation, handleValidationErrors, PostController.update);
// app.get('/posts/user/:userId', cors(), PostController.getAllByAuthor);
// app.patch('/posts/like/:id', cors(), PostController.like);
// app.patch('/posts/unlike/:id', cors(), PostController.unlike);
// app.get('/posts/tags', cors(), PostController.getLastTags);

app.listen(process.env.PORT, (err) => {
    if (err) {
        return console.log(err);
    }
    console.log(`Server started`);
});
