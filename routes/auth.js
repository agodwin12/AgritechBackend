const express = require('express');
const router = express.Router();
const { loginUser, googleLogin, forgotPassword, resetPassword} = require('../controllers/loginController');

router.post('/login', loginUser);
router.post('/auth/google-login', googleLogin);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);



module.exports = router;
