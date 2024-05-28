const User = require('../models/user');

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