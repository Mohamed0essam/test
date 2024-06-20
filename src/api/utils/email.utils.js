const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const createVerification = async (req, res)=>{
    const token = jwt.sign({ userId: user.id }, 'your-secret-key', { expiresIn: '1h' });

    // Send the email
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'talal.d0.m0re@gmail.com ',
            pass: 'domorettb'
        }
    });

    let mailOptions = {
        from: 'talal.d0.m0re@gmail.com ',
        to: user.email,
        subject: 'Email Verification',
        text: `Hello, please verify your email by clicking on the following link: http://localhost:3000/verify-email?token=${token}`
    };

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });

    res.send('Registration successful. Please check your email to verify your account.');
}


const verifyEmail = async (req, res)=>{

    const token = req.query.token;

    // Verify the token
    jwt.verify(token, 'your-secret-key', function(err, decoded) {
        if (err) {
            return res.send('Invalid or expired token.');
        }

        
         //user.isEmailVerified is true
         //get user id from the token
        res.send('Email verified successfully.');
    });
}
   
 


module.exports = {
    
    verifyEmail,
    createVerification,
}