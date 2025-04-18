const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

const { registerUser } = require('../controllers/userController');

// Configure storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Make sure this folder exists
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

router.post('/register', upload.single('profile_image'), registerUser);

module.exports = router;
