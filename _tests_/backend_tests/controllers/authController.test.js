const { 
    getLogin,
    postLogin,
    logout,
    getSignup,
    postSignup
  } = require('../controllers/authController');
  const passport = require('passport');
  const validator = require('validator');
  const User = require('../models/User');
  
  jest.mock('passport');
  jest.mock('validator');
  jest.mock('../models/User');
  
  describe('Auth Controller', () => {
    const req = { 
      body: {},
      user: new User({ /* mock user data */ }),
      logOut: jest.fn(),
      session: { destroy: jest.fn(cb => cb()) }
    };
    const res = {
      render: jest.fn(),
      redirect: jest.fn()
    };
    const next = jest.fn();
  
    beforeEach(() => {
      jest.clearAllMocks();
    });
  
    describe('getLogin', () => {
      it('should redirect to / if user is authenticated', () => {
        req.user = new User({ /* mock user data */ });
  
        getLogin(req, res);
  
        expect(res.redirect).toHaveBeenCalledWith('/');
      });
  
      it('should render login page if user is not authenticated', () => {
        req.user = null;
  
        getLogin(req, res);
  
        expect(res.render).toHaveBeenCalledWith('login', {
          title: 'Login'
        });
      });
    });
  
    describe('postLogin', () => {
      it('should authenticate user and redirect to /', async () => {
        req.body.email = 'test@example.com';
        req.body.password = 'password';
        validator.isEmail.mockReturnValue(true);
        validator.normalizeEmail.mockReturnValue('test@example.com');
        passport.authenticate.mockImplementation((strategy, callback) => {
          callback(null, new User({ /* mock user data */ }), null);
        });
  
        await postLogin(req, res, next);
  
        expect(passport.authenticate).toHaveBeenCalledWith('local', expect.any(Function));
        expect(req.logIn).toHaveBeenCalled();
        expect(res.redirect).toHaveBeenCalledWith('/');
      });
  
      it('should render login page with errors for invalid credentials', async () => {
        req.body.email = 'test@example.com';
        req.body.password = 'password';
        validator.isEmail.mockReturnValue(true);
        validator.normalizeEmail.mockReturnValue('test@example.com');
        passport.authenticate.mockImplementation((strategy, callback) => {
          callback(null, null, 'Invalid credentials');
        });
  
        await postLogin(req, res, next);
  
        expect(res.render).toHaveBeenCalledWith('login', {
          title: 'Login',
          messages: { errors: ['Invalid credentials'] }
        });
        expect(req.logIn).not.toHaveBeenCalled();
      });
  
   // Will add more tests for edge cases if needed
    });
  
    describe('logout', () => {
      it('should log out user and destroy session', () => {
        logout(req, res);
  
        expect(req.logOut).toHaveBeenCalled();
        expect(req.session.destroy).toHaveBeenCalled();
        expect(res.redirect).toHaveBeenCalledWith('/');
      });
  
      it('should handle error during logout', () => {
        const error = new Error('Logout error');
        req.logOut.mockImplementation(callback => callback(error));
  
        logout(req, res);
  
        expect(console.error).toHaveBeenCalledWith('Error logging out:', error);
        expect(next).toHaveBeenCalledWith(error);
      });
  
   // Will add more tests for edge cases if needed
    });
  
    describe('getSignup', () => {
      it('should redirect to / if user is authenticated', () => {
        req.user = new User({ /* mock user data */ });
  
        getSignup(req, res);
  
        expect(res.redirect).toHaveBeenCalledWith('/');
      });
  
      it('should render signup page if user is not authenticated', () => {
        req.user = null;
  
        getSignup(req, res);
  
        expect(res.render).toHaveBeenCalledWith('signup', {
          title: 'Create Account'
        });
      });
    });
  
    describe('postSignup', () => {
      it('should create new user and authenticate', async () => {
        req.body.userName = 'newUser';
        req.body.email = 'newuser@example.com';
        req.body.password = 'newPassword';
        req.body.confirmPassword = 'newPassword';
        validator.isEmail.mockReturnValue(true);
        validator.normalizeEmail.mockReturnValue('newuser@example.com');
        validator.isLength.mockReturnValue(true);
        User.findOne.mockResolvedValue(null);
        bcrypt.hash.mockResolvedValue('hashedPassword');
  
        await postSignup(req, res, next);
  
        expect(User.findOne).toHaveBeenCalledWith({
          $or: [{ email: 'newuser@example.com' }, { userName: 'newUser' }]
        });
        expect(User.prototype.save).toHaveBeenCalled();
        expect(req.logIn).toHaveBeenCalled();
        expect(res.redirect).toHaveBeenCalledWith('/');
      });
  
      it('should render signup page with errors for existing email/username', async () => {
        req.body.userName = 'existingUser';
        req.body.email = 'existinguser@example.com';
        req.body.password = 'password';
        req.body.confirmPassword = 'password';
        validator.isEmail.mockReturnValue(true);
        validator.normalizeEmail.mockReturnValue('existinguser@example.com');
        User.findOne.mockResolvedValue(new User({ /* mock user data */ }));
  
        await postSignup(req, res, next);
  
        expect(User.findOne).toHaveBeenCalled();
        expect(res.render).toHaveBeenCalledWith('signup', {
          title: 'Create Account',
          messages: { errors: [{ msg: 'Account with that email address or username already exists.' }] }
        });
        expect(User.prototype.save).not.toHaveBeenCalled();
      });
  
   // Will add more tests for edge cases if needed
    });
  
  });
  