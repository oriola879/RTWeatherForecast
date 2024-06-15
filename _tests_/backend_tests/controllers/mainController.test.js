const { getIndex, getAccount } = require('../controllers/mainController');
const User = require('../models/User');

jest.mock('passport', () => ({
  authenticate: jest.fn(),
}));

jest.mock('../models/User');

describe('Main Controller', () => {
  const req = {
    user: new User({ /* mock user data */ }),
    isAuthenticated: jest.fn(),
    redirect: jest.fn(),
    render: jest.fn(),
  };
  const res = {
    render: jest.fn(),
    redirect: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getIndex', () => {
    it('should render index page', () => {
      getIndex(req, res);

      expect(res.render).toHaveBeenCalledWith('index', {
        title: 'Homepage',
      });
    });
  });

  describe('getAccount', () => {
    it('should redirect to /login if user is not authenticated', () => {
      req.isAuthenticated.mockReturnValue(false);

      getAccount(req, res);

      expect(res.redirect).toHaveBeenCalledWith('/login');
      expect(res.render).not.toHaveBeenCalled();
    });

    it('should render account page if user is authenticated', () => {
      req.isAuthenticated.mockReturnValue(true);

      getAccount(req, res);

      expect(res.render).toHaveBeenCalledWith('account', {
        title: 'Account',
      });
      expect(res.redirect).not.toHaveBeenCalled();
    });
  });

});
