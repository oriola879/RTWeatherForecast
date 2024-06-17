const { updateUsername, updateEmail, updatePassword } = require('../controllers/accountController');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

jest.mock('../models/User'); 

describe('Account Controller', () => {

  const req = { 
    body: {},
    user: new User({ /* mock user data */ })
  };
  const res = {
    render: jest.fn(),
    redirect: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('updateUsername', () => {
    it('should update username and redirect to /account', async () => {
      req.body.userName = 'newUsername';
      User.findOne.mockResolvedValue(null);

      await updateUsername(req, res);

      expect(req.user.userName).toBe('newUsername');
      expect(req.user.save).toHaveBeenCalled();
      expect(res.redirect).toHaveBeenCalledWith('/account');
    });

    it('should render account page with error message when username is already taken', async () => {
      req.body.userName = 'existingUsername';
      User.findOne.mockResolvedValue(new User({ userName: 'existingUsername' }));

      await updateUsername(req, res);

      expect(res.render).toHaveBeenCalledWith('account', {
        messages: { errors: [{ msg: 'Username is already taken' }] }
      });
      expect(req.user.save).not.toHaveBeenCalled();
    });

    it('should render account page with error message when username is not provided', async () => {
      req.body.userName = '';
      
      await updateUsername(req, res);

      expect(res.render).toHaveBeenCalledWith('account', {
        messages: { errors: [{ msg: 'Username is required' }] }
      });
      expect(req.user.save).not.toHaveBeenCalled(); 
    });

    // Will add more tests for edge cases if needed
  });

  describe('updateEmail', () => {
    it('should update email and redirect to /account', async () => {
      req.body.email = 'new@example.com';
      req.body.confirmEmail = 'new@example.com';
      User.findOne.mockResolvedValue(null);

      await updateEmail(req, res);

      expect(req.user.email).toBe('new@example.com');
      expect(req.user.save).toHaveBeenCalled();
      expect(res.redirect).toHaveBeenCalledWith('/account');
    });

    it('should render account page with error message when email is already in use', async () => {
      req.body.email = 'existing@example.com';
      req.body.confirmEmail = 'existing@example.com';
      User.findOne.mockResolvedValue(new User({ email: 'existing@example.com' }));

      await updateEmail(req, res);

      expect(res.render).toHaveBeenCalledWith('account', {
        messages: { errors: [{ msg: 'Email is already in use' }] }
      });
      expect(req.user.save).not.toHaveBeenCalled();
    });

    it('should render account page with error message when email is not valid or does not match confirmation', async () => {
      req.body.email = 'invalidemail';
      req.body.confirmEmail = 'invalidemail';

      await updateEmail(req, res);

      expect(res.render).toHaveBeenCalledWith('account', {
        messages: { errors: [{ msg: 'Please enter a valid email and make sure they match' }] }
      });
      expect(req.user.save).not.toHaveBeenCalled();
    });

   // Will add more tests for edge cases if needed
  });

  describe('updatePassword', () => {
    it('should update password and redirect to /account', async () => {
      req.body.password = 'newPassword';
      req.body.confirmPassword = 'newPassword';
      bcrypt.hash.mockResolvedValue('hashedPassword');

      await updatePassword(req, res);

      expect(bcrypt.hash).toHaveBeenCalledWith('newPassword', 10);
      expect(req.user.password).toBe('hashedPassword');
      expect(req.user.save).toHaveBeenCalled();
      expect(res.redirect).toHaveBeenCalledWith('/account');
    });

    it('should render account page with error message when passwords do not match', async () => {
      req.body.password = 'password1';
      req.body.confirmPassword = 'password2';

      await updatePassword(req, res);

      expect(res.render).toHaveBeenCalledWith('account', {
        messages: { errors: [{ msg: 'Passwords must match and be at least 8 characters long' }] }
      });
      expect(req.user.save).not.toHaveBeenCalled();
    });

    it('should render account page with error message when password length is less than 8', async () => {
      req.body.password = 'short';
      req.body.confirmPassword = 'short';

      await updatePassword(req, res);

      expect(res.render).toHaveBeenCalledWith('account', {
        messages: { errors: [{ msg: 'Passwords must match and be at least 8 characters long' }] }
      });
      expect(req.user.save).not.toHaveBeenCalled();
    });

   // Will add more tests for edge cases if needed
  });

});
