const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const cookieParser = require('cookie-parser');

const AppError = require('./utils/appError');
const userRoutes = require('./routes/userRoutes');
const panelDbRoutes = require('./routes/panelDbRoutes');
const globalErrorHandler = require('./controllers/errorController');
const newsScrape = require('./newsPortal');

const app = express();
// const jsonParser = express.json();

const timerHour = process.env.TIMER_NEWS * 60 * 60 * 1000;
newsScrape();
setInterval(newsScrape, timerHour);

app.set('view engine', 'pug');

// GLOBAL MIDDLEWARES
// Set security HTTP headers
app.use(helmet());

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Limit requests from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!',
});
app.use('/', limiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Serving static files
app.use(express.static(`${__dirname}/public`));

// test middleware
// app.use((req, res, next) => {
//   console.log(req.cookies);
//   console.log(req.originalUrl);
//   next();
// });

// ROUTES
app.use('/', panelDbRoutes);

app.use('/login', userRoutes);

app.all('*', (req, res, next) => {
  next(new AppError(`Not Found ${req.originalUrl}`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
