// unit-tests/authController.unit.test.js

const { getSignup } = require('../controllers/authController');

describe('Unit Tests - getSignup Function', () => {
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
    getSignup(req, res);
    expect(res.redirect).toHaveBeenCalledWith('/');
  });

  it('should render signup page if user is not authenticated', () => {
    getSignup(req, res);
    expect(res.render).toHaveBeenCalledWith('signup', { title: 'Create Account' });
  });
});
