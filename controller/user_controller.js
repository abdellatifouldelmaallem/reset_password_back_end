const User = require('../models/user');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const secret = process.env.SECRET_TOKEN

const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // Use `true` for port 465, `false` for all other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.PASSWORD_USER
  }
});

exports.login = async (req,res)=>{
 const {email, password} = req.body
 try {
    let user = await User.findOne({where:{email:email}})
    if (!user) {
        return res.status(401).json({ message: 'Invalid username or password' });
    }

    let matchPassword = await User.findOne({where:{password:password}})
    if (!matchPassword) {
        return res.status(401).json({ message: 'Invalid username or password' });
    }
    // Store user information in session
    req.session.user = { id: user.id, email: user.email };
    res.status(200).json({ message: 'Login successful' });

 } catch (error) {
    res.status(500).json({ message: 'Internal server error',error });
 }
}

exports.logout = (req, res) => {
    if (req.session.user) {
      req.session.destroy(err => {
        if (err) {
          return res.status(500).json({ message: 'Logout failed' });
        }
        res.clearCookie('connect.sid'); // Clears the cookie
        res.status(200).json({ message: 'Logout successful' });
      });
    } else {
      res.status(400).json({ message: 'Not logged in' });
    }
  };
  
  exports.me = (req, res) => {
    if (req.session.user) {
      res.status(200).json({ user: req.session.user });
    } else {
      res.status(401).json({ message: 'Not authenticated' });
    }
  };

  exports.forgetPassword = async (req, res)=>{
    const {email} = req.body.email;
    const oldUser = await User.findOne({email})
    
    if (!oldUser) {
      return res.status(404).send('the user not found')
    } 

    token = jwt.sign({email: oldUser.email}, secret, {expiresIn:'15m'})

    const resetLink = `http://localhost:3000/api/resetPassword/${oldUser.id}/${token}`;

    console.log(resetLink)

    const mailOptions = {
      from: 'no@reply.com',
      to: oldUser.email,
      subject: 'Password Reset',
      text: `Click here to reset your password: ${resetLink}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
        return res.status(500).send('Error sending email');
      }
      console.log('Email sent: ' + info.response);
      res.send('Password reset email sent');
    });
  }


  exports.resetPasswordWithGet = async (req, res) => {
    try {
      const { token } = req.params;
      // const newPassword = req.body.password;
      const verificatonToken = jwt.verify(token, secret);
      
      const userWithNewPW = await User.findOne({ email: verificatonToken.email });
      
      if (!userWithNewPW) {
        return res.status(404).send('User not found');
      }
      
      await User.update({ password: newPassword }, { where: { email: verificatonToken.email } });
      res.send('Password has been reset');
    } catch (error) {
      res.status(400).send('Invalid or expired token');
      console.log('Error: ' + error);
    }
  };

  exports.resetPasswordWithPost = async (req, res) => {
    try {
      const { token } = req.params;
      const { newPassword, confirmedPassword} = req.body;
      const verificatonToken = jwt.verify(token, secret);
      
      const userWithNewPW = await User.findOne({ email: verificatonToken.email });
      
      if (!userWithNewPW) {
        return res.status(404).send('User not found');
      }

      if (newPassword !== confirmedPassword) {
        return res.status(422).send('two password does not match');
      }
      
      await User.update({ password: newPassword }, { where: { email: verificatonToken.email } });
      res.send('Password has been reset');
    } catch (error) {
      res.status(400).send('Invalid or expired token');
      console.log('Error: ' + error);
    }
  };