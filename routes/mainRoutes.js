const express = require('express');
//const mainController = require('../controllers/mainController')
const authController = require('../controllers/authController')
const mainController = require('../controllers/mainController')
const accountController = require('../controllers/accountController');
const { ensureAuth } = require('../middleware/auth')
const router = express.Router();

router.get('/', mainController.getIndex)
router.get('/account',ensureAuth, mainController.getAccount)
router.post('/account/update-username',ensureAuth, accountController.updateUsername);
router.post('/account/update-email',ensureAuth, accountController.updateEmail);
router.post('/account/update-password',ensureAuth,accountController.updatePassword);
router.get('/login', authController.getLogin);
router.post('/login', authController.postLogin);
router.get('/signup', authController.getSignup);
router.post('/signup', authController.postSignup);
router.get('/logout',ensureAuth, authController.logout);

module.exports = router