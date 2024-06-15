const accountController = require('../controllers/accountController');

describe('Account Controller', () => {
  describe('getAccount', () => {
    it('should render the account page if user is authenticated', () => {
      const req = { user: { username: 'testuser' } };
      const res = {
        render: jest.fn(),
      };

      accountController.getAccount(req, res);

      expect(res.render).toHaveBeenCalledWith('account', {
        title: 'Account',
        user: req.user,
      });
    });

    it('should redirect to login if user is not authenticated', () => {
      const req = { user: null };
      const res = {
        redirect: jest.fn(),
        render: jest.fn(),
      };

      accountController.getAccount(req, res);

      expect(res.redirect).toHaveBeenCalledWith('/login');
      expect(res.render).not.toHaveBeenCalled();
    });
  });
});
