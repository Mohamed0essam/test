const express  = require('express');
const router   = express.Router();
const authnController = require('../controllers/authn.controller');
const AuthMiddle = require('../middlewares/authentication.middle');

// just for testing
router.route('/getall').get(authnController.getAllUsers)

//router.get('/getall', (req, res)=>{res.send('hey test all users')});

router.post('/register', authnController.register);
router.post('/login', authnController.login);
router.route('/key-login').post(authnController.keyLogin)
//router.delete('/logout', authnController.logout);

router.route('/refresh-session').patch(AuthMiddle.checkSession, authnController.refreshSessionToken)
router.route('/reset-password').patch(AuthMiddle.checkSession, authnController.resetPassword)

// router.post('/verify-email', authnController.verifyEmail);
// router.post('/change-password', authnController.changePassword);
// router.post('/forgot-password', authnController.forgotPassword);

      
module.exports = router;