const express = require('express');
const router = express.Router();
const { getMyProfile } = require('../controllers/myProfileController');
const { authenticate } = require('../middleware/authMiddleware'); // <-- FIXED

router.get('/', authenticate, getMyProfile); // <-- Now valid

module.exports = router;
