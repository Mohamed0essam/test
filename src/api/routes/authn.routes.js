const express  = require('express');
const router   = express.Router();
const authnController = require('../controllers/authn.controller');


// just for testing
router.route('/getall').get(authnController.getAllUsers)

//router.get('/getall', (req, res)=>{res.send('hey test all users')});

router.post('/register', authnController.register);
router.post('/login', authnController.login);
//router.delete('/logout', authnController.logout);


// router.post('/verify-email', authnController.verifyEmail);
// router.post('/change-password', authnController.changePassword);
// router.post('/forgot-password', authnController.forgotPassword);

      
module.exports = router;