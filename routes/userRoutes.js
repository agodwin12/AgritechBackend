const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { changePassword } = require('../controllers/userController');

const { registerUser } = require('../controllers/userController');
const { getUserProfile } = require('../controllers/myProfileController');
const { authenticate } = require('../middleware/auth'); // 🔐

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

router.post('/register', upload.single('profile_image'), registerUser);
router.get('/:userId/profile', authenticate, getUserProfile); // 🔐 Secured
router.post('/change-password', authenticate, changePassword);

module.exports = router;
