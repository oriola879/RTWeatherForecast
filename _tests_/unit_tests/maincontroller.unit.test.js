const mainController = require('../controllers/mainController');

describe('Main Controller', () => {
  describe('getIndex', () => {
    it('should render the index page if user is authenticated', () => {
      const req = { user: { username: 'testuser' } };
      const res = {
        redirect: jest.fn(),
        render: jest.fn(),
      };

      mainController.getIndex(req, res);

      expect(res.redirect).not.toHaveBeenCalled();
      expect(res.render).toHaveBeenCalledWith('index', {
        title: 'Home',
        user: req.user,
      });
    });

    it('should redirect to login if user is not authenticated', () => {
      const req = { user: null };
      const res = {
        redirect: jest.fn(),
        render: jest.fn(),
      };

      mainController.getIndex(req, res);

      expect(res.redirect).toHaveBeenCalledWith('/login');
      expect(res.render).not.toHaveBeenCalled();
    });
  });
});
