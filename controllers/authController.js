const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const Admin = require('../models/userModel');
const AppError = require('../utils/appError');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

  res.cookie('jwt', token, cookieOptions);

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      User: user.user,
    },
  });
};

exports.login = async (req, res, next) => {
  const { username, password } = req.body;

  // 1) Check if email and password exist
  if (!username || !password) {
    return next(new AppError('Please provide email and password!', 400));
  }

  // DISABLE VERIFICATION FOR DEVELOPMENT
  if (process.env.NODE_ENV === 'development') {
    const userTest = { user: 'test', password: 'test' };
    createSendToken(userTest, 200, res);
    return;
  }

  // 2) Check if user exists && password is correct
  const user = await Admin.findOne({ user: username }).select('+password');

  if (!user || !(await user.correctPassword(password, user._doc.password))) {
    return next(new AppError('Incorrect username or password', 401));
  }

  // 3) If everything ok, send token to client
  createSendToken(user._doc, 200, res);
};

exports.protect = async (req, res, next) => {
  // 1) Getting token and check of it's there
  let token;

  if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return res.redirect('/login');
  }

  // 2) Verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  if (process.env.NODE_ENV !== 'development') {
    // 3) Check if user still exists
    const currentUser = await Admin.findById(decoded.id).lean();

    if (!currentUser) {
      return res.redirect('/login');
    }
  }

  // GRANT ACCESS TO PROTECTED ROUTE

  next();
};

exports.isLoggedIn = async (req, res, next) => {
  if (req.cookies.jwt) {
    try {
      // 1) verify token
      const decoded = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRET);

      // 2) Check if user still exists
      const currentUser = await Admin.findById(decoded.id);
      if (process.env.NODE_ENV === 'production' && !currentUser) {
        return next();
      }

      // THERE IS A LOGGED IN USER
      return res.redirect('/page/1');
    } catch (err) {
      return next();
    }
  }
  next();
};
