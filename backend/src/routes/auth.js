const express = require('express');
const authController = require('../controller/usercontroller');
const upload = require('../config/multer');
const authMiddleware = require('../middleware/authmid');
const router = express.Router();

router.post('/register',upload.single('profile'), authController.register);
router.post('/login', authController.login);
router.get('/profile', authMiddleware.verifyToken, authController.getProfile);
router.get('/verify-email', authController.verifyEmail);
router.post('/request-password-reset', authController.requestPasswordReset);
router.post('/reset-password', authController.resetPassword);

module.exports = router;
