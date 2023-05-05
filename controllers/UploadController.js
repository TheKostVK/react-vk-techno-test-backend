// Создаем экземпляр Dropbox с помощью access token
import {Dropbox} from "dropbox";
// Получение токена дропБокс
const dbx = new Dropbox({accessToken: process.env.DROPBOX_ACCESS_TOKEN});

export const uploadDBX = async (req, res) => {
    try {
        const file = req.file.buffer;
        const fileName = req.file.originalname;
        const extension = fileName.substring(fileName.lastIndexOf('.'));
        const randomString =
            Math.random().toString(36).substring(2, 15) +
            Math.random().toString(36).substring(2, 15);
        const newFileName =
            fileName.replace(extension, '') + '_' + randomString + extension;
        const dropboxPath = `/uploads/${req.body.savePath}` + newFileName;

        const uploadResponse = await dbx.filesUpload({
            path: dropboxPath,
            contents: file,
        });

        const sharedLinkResponse = await dbx.sharingCreateSharedLinkWithSettings({
            path: uploadResponse.result.path_display,
            settings: {
                requested_visibility: {'.tag': 'public'},
            },
        });

        const downloadUrl = sharedLinkResponse.result.url.replace(
            'www.dropbox.com',
            'dl.dropboxusercontent.com'
        );

        res.json({url: downloadUrl});
    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'Ошибка при выгрузке файла'});
    }
}