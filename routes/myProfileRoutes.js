const express = require('express');
const router = express.Router();
const { getMyProfile } = require('../controllers/myProfileController');
const { authenticate } = require('../middleware/authMiddleware');
const {updateMyProfile} = require('../controllers/myProfileController');

router.get('/', authenticate, getMyProfile);

router.put('/', authenticate, updateMyProfile);

module.exports = router;
