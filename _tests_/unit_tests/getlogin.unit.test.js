// unit-tests/authController.unit.test.js

const { getLogin } = require('../controllers/authController');

describe('Unit Tests - getLogin Function', () => {
  let req, res;

  beforeEach(() => {
    req = { user: null };
    res = {
      redirect: jest.fn(),
      render: jest.fn(),
    };
  });

  it('should redirect to "/" if user is authenticated', () => {
    req.user = { /* mock user object */ };
    getLogin(req, res);
    expect(res.redirect).toHaveBeenCalledWith('/');
  });

  it('should render login page if user is not authenticated', () => {
    getLogin(req, res);
    expect(res.render).toHaveBeenCalledWith('login', { title: 'Login' });
  });
});
