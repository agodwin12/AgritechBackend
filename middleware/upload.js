// middlewares/upload.js
const multer = require('multer');
const path = require('path');

// Set up storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    },
});

// File filter
const fileFilter = function (req, file, cb) {
    const allowedTypes = ['.jpg', '.jpeg', '.png', '.gif'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(ext)) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed'));
    }
};

// Multer instance
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
});

module.exports = upload;
