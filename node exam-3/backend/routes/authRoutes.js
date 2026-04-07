const express = require('express');
const router = express.Router();
const { registerUser, loginUser, logoutUser, getMe } = require('../controllers/authController');
const { verifyJWT } = require('../middleware/auth');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser); // Alternatively GET as per requirements, but POST is better practice. Let's provide GET for requirement compliance
router.get('/logout', logoutUser);
router.get('/me', verifyJWT, getMe);

module.exports = router;
