const express = require('express');
//const mainController = require('../controllers/mainController')
const authController = require('../controllers/authController')
const mainController = require('../controllers/mainController')
const accountController = require('../controllers/accountController');
const router = express.Router();

router.get('/', mainController.getIndex)
router.get('/account', mainController.getAccount)
router.post('/account/update-username', accountController.updateUsername);
router.post('/account/update-email', accountController.updateEmail);
router.post('/account/update-password', accountController.updatePassword);
router.get('/login', authController.getLogin);
router.post('/login', authController.postLogin);
router.get('/signup', authController.getSignup);
router.post('/signup', authController.postSignup);
router.get('/logout', authController.logout);

// router.get('/projects', mainController.getProjects)
// router.get('/posts', mainController.getPosts)

//language switching 
// router.get('/index', (req, res) => {
//     const lang = req.query.clang;
//     if(lang === 'al'|| lang === "en"){
//         res.redirect("/");
//     }
// });

// //This was made to make the link that appears on google to redirect to our page
// router.get('/en', (req, res) => {
//         res.redirect("/");
// });


module.exports = router