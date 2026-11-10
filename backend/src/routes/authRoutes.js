const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authController');

router.post('/login', AuthController.login);

router.post('/cadastro', AuthController.cadastro);

module.exports = router;