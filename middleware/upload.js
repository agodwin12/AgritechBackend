const multer = require('multer');
const path = require('path');

// Storage setup
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    },
});

// File filter to accept images and videos
const fileFilter = function (req, file, cb) {
    const allowedExtensions = [
        '.jpg', '.jpeg', '.png', '.gif',     // Images
        '.mp4', '.mov', '.avi', '.webm', '.mkv' // Videos
    ];
    const ext = path.extname(file.originalname).toLowerCase();

    if (allowedExtensions.includes(ext)) {
        cb(null, true);
    } else {
        cb(new Error('Only image and video files are allowed'));
    }
};

// Multer instance with optional file size limit
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 50 * 1024 * 1024, // Max 50MB
    }
});

module.exports = upload;
