const express = require('express');
const { registerUser, loginUser, getProfile } = require('../controllers/userController');
const validateRequest = require('../middleware/validateRequest');
const { registerSchema, loginSchema } = require('../validators/userValidators');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/register', validateRequest(registerSchema), registerUser);
router.post('/login', validateRequest(loginSchema), loginUser);
router.get('/me', auth, getProfile);

module.exports = router;
