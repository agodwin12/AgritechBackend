const express = require('express');
const router = express.Router();
const multer = require('multer');
const { registerUser } = require('../controllers/userController');

// Configure multer for single file upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Make sure this folder exists
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    },
});

const upload = multer({ storage });

router.post('/register', upload.single('profile_image'), registerUser);

module.exports = router;
