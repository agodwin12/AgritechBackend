const express = require('express');
const router = express.Router();
const videoController = require('../controllers/videoController');
const { authenticate, authorizeAdmin } = require('../middleware/authMiddleware');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

// Create a video tip
router.post('/videos', authenticate, upload.fields([
    { name: 'video_url', maxCount: 1 },
    { name: 'thumbnail_image', maxCount: 1 },
]), videoController.uploadVideo);

// Get all approved videos or filter by category
router.get('/videos', videoController.getApprovedVideos);

router.delete('/videos/:id', authenticate, videoController.deleteVideo);


// Approve a video
router.put('/videos/:id/approve', authenticate, authorizeAdmin, videoController.approveVideo);
router.delete('/videos/:id/reject', authenticate, authorizeAdmin, videoController.rejectVideo);

// Video Categories
router.post('/videos/categories', authenticate, authorizeAdmin, videoController.createCategory);
router.get('/videos/categories', videoController.getCategories);

module.exports = router;
