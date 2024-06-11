const express = require('express');
const authController = require('../controllers/authController');
const weatherRoutes = require('./weatherRoutes');
const router = express.Router();

router.use('/weather', weatherRoutes);
router.get('/login', authController.getLogin);
router.post('/login', authController.postLogin);
router.get('/signup', authController.getSignup);
router.post('/signup', authController.postSignup);
router.get('/logout', authController.logout);

module.exports = router;