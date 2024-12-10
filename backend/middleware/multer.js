const multer = require('multer');
const path = require('path');

const setupMulter = (folder = 'uploads/', fileField = 'file', multiple = false, maxCount = 10) => {
    const storage = multer.diskStorage({
        destination: folder,
        filename: (req, file, cb) => cb(null, file.originalname),
    });

    const fileFilter = (req, file, cb) => {
        const allowedTypes = /jpg|jpeg|png|svg/;
        const isValidType =
            allowedTypes.test(path.extname(file.originalname).toLowerCase()) &&
            (file.mimetype.startsWith('image/') || file.mimetype.startsWith('application/'));

        cb(null, isValidType || 'Error: Unsupported file type!');
    };

    const upload = multer({ storage, fileFilter });
    return multiple ? upload.array(fileField, maxCount) : upload.single(fileField);

};

module.exports = setupMulter;
