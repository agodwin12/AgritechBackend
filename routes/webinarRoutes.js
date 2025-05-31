const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload'); // your multer config
const webinarController = require('../controllers/webinarController');

// === Public/User Routes ===
router.post('/request', upload.single('image'), webinarController.requestWebinar);
router.get('/upcoming', webinarController.getUpcomingWebinars);         // Everyone can view upcoming webinars
router.post('/:id/join', webinarController.joinWebinar);                // User joins a webinar
router.post('/:id/questions', webinarController.submitQuestion);        // User submits a question

// === Admin Routes ===
router.get('/requests/pending', webinarController.getPendingRequests);  // Admin views pending webinar requests
router.post('/approve/:id', webinarController.approveWebinarRequest);   // Admin approves a request & creates webinar
router.patch('/questions/:id/answer', webinarController.markQuestionAnswered); // Admin marks a question as answered
router.post('/', webinarController.createWebinar); // Admin creates webinar manually


module.exports = router;
