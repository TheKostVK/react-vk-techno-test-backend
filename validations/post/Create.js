import {body} from 'express-validator';

export const postCreateValidation = [
    body('title', 'Введите заголовок статьи длиннее 3-ех символов').isLength({min: 1}).isString(),
    body('text', 'Текст статьи должен быть длинной не менее 10-и символов').isLength({min: 1}).isString(),
    body('tags', 'Неверный формат тэгов (должен быть массив)').optional().isArray(),
    body('imageUrl', 'Неверная ссылка на изображение').optional().isString(),
];