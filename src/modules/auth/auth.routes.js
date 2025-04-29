const express = require('express');
const router = express.Router();
const authController = require('./controller/auth.controller');
const { requireAuth } = require('../../utils/middleware/auth');
const { validateLogin, validateRegister, validateResults } = require('./scream/auth.scream');

// Rutas públicas
router.post('/login', validateLogin, validateResults, authController.login);
router.post('/register', validateRegister, validateResults, authController.register);
router.post('/logout', authController.logout);

// Rutas protegidas
router.get('/profile', requireAuth, authController.getProfile);

module.exports = router; 