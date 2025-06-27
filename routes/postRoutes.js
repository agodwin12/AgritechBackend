const express = require('express');
const router = express.Router();
const PostController = require('../controllers/PostController');
const multer = require('multer');
const path = require('path');

// multer config
const storage = multer.diskStorage({
    destination: 'uploads/',
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9) + path.extname(file.originalname);
        cb(null, uniqueName);
    }
});
const upload = multer({ storage });

router.get('/posts', PostController.getPosts);
router.post('/posts', upload.single('image'), PostController.createPost);

router.post('/posts/:postId/like', PostController.likePost);
router.post('/comments/:commentId/like', PostController.likeComment);

router.post('/comments', PostController.createComment);

module.exports = router;
