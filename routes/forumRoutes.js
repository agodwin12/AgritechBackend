const express = require('express');
const router = express.Router();
const ForumController = require('../controllers/ForumController');
const multer = require('multer');
const path = require('path');

// Configure multer
const storage = multer.diskStorage({
    destination: 'uploads/',
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9) + path.extname(file.originalname);
        cb(null, uniqueName);
    }
});
const upload = multer({ storage });

// Routes
router.get('/messages', ForumController.getMessages);
router.post('/messages', upload.single('image'), ForumController.postMessage);
router.post('/messages/:id/like', ForumController.likeMessage);

module.exports = router;
