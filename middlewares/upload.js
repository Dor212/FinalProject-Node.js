import fs from "fs";
import {randomUUID} from "crypto";
import multer from "multer";

const normalizeFileName = (fileName) => {
    return Buffer.from(fileName, 'latin1').toString('utf8');
};

const dest = multer.diskStorage({
    destination:(req, file, callback)=>{
        const dir = `public/upload/${req.user.id}`;
        fs.mkdirSync(dir, {recursive: true});
        callback(null, dir);
    },
    filename:(req, file, callback) => {
        const normalizedFilename = `${randomUUID()}-${normalizeFileName(
          file.originalname
        )}`;
        req.fileName = `http://localhost:8080/uploads/${req.user.id}/${normalizeFileName}`;
        callback(null, normalizedFilename);
    }
});

export const upload = multer({
    storage: dest,
    limits:{fileSize:1000000},
    fileFilter:(req, file, callback) => {
        const normalizedFilename = normalizeFileName(file.originalname);
        
        if(!normalizedFilename.match(/\.(pdf|docx|doc|png|jpg|jpeg)$/)){
            return callback(
                new Error("Please upload aPDF or image")
            );
        }
        callback(null, true);
    }
}).single('file')