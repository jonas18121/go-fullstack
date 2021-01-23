const { request } = require('express');
/** doc_14.md, package multer */
const multer = require('multer');

const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
};

const storage = multer.diskStorage({

    destination: (request, file, callback) => {
        callback(null, 'images');
    },

    filename: (request, file, callback) => {
        const name = file.originalname.split(' ').join('_');
        const extension = MIME_TYPES[file.mimetype]; 
        const newNameImages = name + Date.now() + '.' + extension; 
        callback(null, newNameImages);
    }
});

module.exports = multer({storage: storage}).single('image');