const User = require('../models/User');
const validator = require('validator');
const bcrypt = require('bcryptjs');

exports.updateUsername = async (req, res) => {
  try {
    const { userName } = req.body;
    if (!userName) {
      return res.render('account', {
        messages: { errors: [{ msg: 'Username is required' }] },
      });
    }

    const existingUser = await User.findOne({ userName });
    if (existingUser) {
      return res.render('account', {
        messages: { errors: [{ msg: 'Username is already taken' }] },
      });
    }

    req.user.userName = userName;
    await req.user.save();

    res.redirect('/account');
  } catch (err) {
    console.error('Error updating username:', err);
    res.render('account', {
      messages: { errors: [{ msg: 'Error updating username' }] },
    });
  }
};

exports.updateEmail = async (req, res) => {
  try {
    const { email, confirmEmail } = req.body;
    if (!validator.isEmail(email) || email !== confirmEmail) {
      return res.render('account', {
        messages: { errors: [{ msg: 'Please enter a valid email and make sure they match' }] },
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.render('account', {
        messages: { errors: [{ msg: 'Email is already in use' }] },
      });
    }

    req.user.email = email;
    await req.user.save();

    res.redirect('/account');
  } catch (err) {
    console.error('Error updating email:', err);
    res.render('account', {
      messages: { errors: [{ msg: 'Error updating email' }] },
    });
  }
};

exports.updatePassword = async (req, res) => {
    try {
      const { password, confirmPassword } = req.body;
      
      // Debugging: Check if password and confirmPassword are received
      console.log('Password:', password);
      console.log('Confirm Password:', confirmPassword);
  
      if (password !== confirmPassword || !validator.isLength(password, { min: 8 })) {
        return res.render('account', {
          messages: { errors: [{ msg: 'Passwords must match and be at least 8 characters long' }] },
        });
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Debugging: Check the hashed password before saving
      console.log('Hashed Password:', hashedPassword);
  
      // Ensure req.user is properly populated
      console.log('User:', req.user);
      if (!req.user) {
        return res.render('account', {
          messages: { errors: [{ msg: 'User not authenticated' }] },
        });
      }
  
      req.user.password = hashedPassword;
      await req.user.save();
  
      res.redirect('/account');
    } catch (err) {
      console.error('Error updating password:', err);
  
      // Debugging: Output error message
      res.render('account', {
        messages: { errors: [{ msg: 'Error updating password' }] },
      });
    }
  };