const express = require('express');
const router = express.Router();
const { getMyProfile } = require('../controllers/myProfileController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware, getMyProfile);

module.exports = router;
