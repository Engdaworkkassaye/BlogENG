const bcrypt = require('bcrypt');
const User = require('../models/User');

class UserController {
  static async signUpPage(req, res) {
    res.render('signup');
  }

  static async signUp(req, res) {
    try {
      const { username, password } = req.body;
      const existingUser = await User.findOne({ where: { username } });
      if (existingUser) {
        return res.render('error', { error: 'Username already exists' });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      await User.create({ username, password: hashedPassword });
      res.render('success', { message: 'User created successfully' });
    } catch (error) {
      console.log(error);
      res.render('error', { error: 'Internal server error' });
    }
  }

  static async signInPage(req, res) {
    res.render('login');
  }

  static async signIn(req, res) {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ where: { username } });
        if (!user) {
            return res.render('error', { error: 'Invalid username or password' });
        }
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.render('error', { error: 'Invalid username or password' });
        }
        req.session.userId = user.id;
        req.session.loggedIn = true;

        req.session.save((err) => {
            if (err) {
                console.error(err);
                return res.render('error', { error: 'Internal server error' });
            }
            res.redirect('/posts');
        });
    } catch (error) {
        console.error(error);
        res.render('error', { error: 'Internal server error' });
    }
}

  static signOut(req, res) {
    req.session.destroy();
    res.render('login');
  }

  static checkAuthentication(req, res, next) {
    const loggedIn = req.session.loggedIn || false; // Default to false if not logged in

    if (loggedIn) {
      next();
    } else {
      res.render('error', { error: 'You must be logged in to access this resource' });
    }
  }
}

module.exports = UserController;
