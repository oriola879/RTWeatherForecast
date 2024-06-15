// unit-tests/authController.unit.test.js

const { logout } = require('../controllers/authController');

describe('Unit Tests - logout Function', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      logout: jest.fn(callback => callback()),
      session: {
        destroy: jest.fn(callback => callback()),
      },
    };
    res = {
      redirect: jest.fn(),
    };
    next = jest.fn();
  });

  it('should logout user and destroy session', () => {
    logout(req, res);
    expect(req.logout).toHaveBeenCalled();
    expect(req.session.destroy).toHaveBeenCalled();
    expect(res.redirect).toHaveBeenCalledWith('/');
  });

  it('should handle error during logout', () => {
    const error = new Error('Logout error');
    req.logout.mockImplementation(callback => callback(error));

    logout(req, res, next);
    expect(next).toHaveBeenCalledWith(error);
  });
});
