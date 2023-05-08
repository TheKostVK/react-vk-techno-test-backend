import {body} from 'express-validator';

export const postCreateValidation = [
    body('text', 'Текст статьи должен быть длинной не менее 1-и символов').isLength({min: 1}).isString(),
];