const express = require('express');
const morgan = require('morgan');
const path = require('path');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');

const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// 1 GLOBAL MIDDLEWARES

//SERVING STATIC FILES
// app.use(express.static(`${__dirname}/public`))
app.use(express.static(path.join(__dirname, 'public')));

// SET SECURITY HTPP HEADER
app.use(helmet());

//DEVELOPMENT LOGGING
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// LIMIT REQUESTS
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP',
});
app.use('/api', limiter);

//BODY PARSER, reading and limiting the data from the body into req.body
app.use(express.json({ limit: '10kb' }));

// DATA SANITIZATION against nosql query injection
app.use(mongoSanitize());

// DATA SANITIZATION against XSS
app.use(xss());

//Prevent Parameter Pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  })
);

// app.use((req, res, next) => {
//   console.log('hello from the middleware');
//   next();
// });

//TEST middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// 2 ROUTES
app.get('/', (req, res) => {
  // res.set('Content-Security-Policy', "default-src 'self'");
  // res.set('Content-Type', 'text/html');
  res.status(200).render('base', {
    tour: 'The Forest Hiker',
    user: 'Jonas',
  });
});

app.get('/overview', (req, res) => {
  res.status(200).render('overview', {
    title: 'All Tours',
  });
});

app.get('/tour', (req, res) => {
  res.status(200).render('tour', {
    title: 'The Forest Hike',
  });
});

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);

app.all('*', (req, res, next) => {
  // res.status(404).json({
  //   status: 'fail',
  //   message: `can not find ${req.originalUrl}`,
  // });

  // const err = new Error(`can not find ${req.originalUrl}`);
  // err.status = 'fail';
  // err.statusCode = 404;

  next(new AppError(`can not find ${req.originalUrl}`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
