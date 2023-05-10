import {body} from 'express-validator';

export const registerValidation = [
    body('email', 'Неверный формат почты').isEmail(),
    body('password', 'Пароль должен быть минимум 5-и символов').isLength({min: 5}),
    body('userName', 'Укажите имя').isLength({min: 3}),
];