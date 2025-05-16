const express = require('express');
const router = express.Router();
const { loginUser, googleLogin } = require('../controllers/loginController');

router.post('/login', loginUser);
router.post('/auth/google-login', googleLogin);

module.exports = router;
