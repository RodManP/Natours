const express = require('express');
const morgan = require('morgan');
const path = require('path');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const viewRouter = require('./routes/viewRoutes');

const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// 1 GLOBAL MIDDLEWARES

//SERVING STATIC FILES
// app.use(express.static(`${__dirname}/public`))
app.use(express.static(path.join(__dirname, 'public')));

// SET SECURITY HTPP HEADER
// app.use(helmet());


app.use(
  helmet({
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: {
      allowOrigins: ['*'],
    },
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ['*'],
        scriptSrc: ["* data: 'unsafe-eval' 'unsafe-inline' blob:"],
      },
    },
  })
);


// app.use(
//   helmet.contentSecurityPolicy({
//     directives: {
//       defaultSrc: ["'self'", 'data:', 'blob:'],
//       baseUri: ["'self'"],
//       fontSrc: ["'self'", 'https:', 'data:'],
//       // scriptSrc: ["'self'", 'https://*.cloudflare.com'],
//       // scriptSrc: ["'self'", 'https://*.stripe.com'],
//       scriptSrc: ["'self'", 'https://*.mapbox.com'],
//       frameSrc: ["'self'", 'https://*.stripe.com'],
//       objectSrc: ["'none'"],
//       styleSrc: ["'self'", 'https:', "'unsafe-inline'"],
//       workerSrc: ["'self'", 'data:', 'blob:'],
//       childSrc: ["'self'", 'blob:'],
//       imgSrc: ["'self'", 'data:', 'blob:'],
//       connectSrc: ["'self'", 'blob:', 'https://*.mapbox.com'],
//       upgradeInsecureRequests: [],
//     },
//   })
// );

// app.use(
//   helmet({
//     contentSecurityPolicy: {
//       directives: {
//         defaultSrc: ["'self'", 'data:', 'blob:', 'https:', 'ws:'],
//         baseUri: ["'self'"],
//         fontSrc: ["'self'", 'https:', 'data:'],
//         scriptSrc: [
//           "'self'",
//           'https:',
//           'http:',
//           'blob:',
//           'https://*.mapbox.com',
//           'https://js.stripe.com',
//           'https://m.stripe.network',
//           'https://*.cloudflare.com',
//         ],
//         frameSrc: ["'self'", 'https://js.stripe.com'],
//         objectSrc: ["'none'"],
//         styleSrc: ["'self'", 'https:', "'unsafe-inline'"],
//         workerSrc: [
//           "'self'",
//           'data:',
//           'blob:',
//           'https://*.tiles.mapbox.com',
//           'https://api.mapbox.com',
//           'https://events.mapbox.com',
//           'https://m.stripe.network',
//         ],
//         childSrc: ["'self'", 'blob:'],
//         imgSrc: ["'self'", 'data:', 'blob:'],
//         formAction: ["'self'"],
//         connectSrc: [
//           "'self'",
//           "'unsafe-inline'",
//           'data:',
//           'blob:',
//           'https://*.stripe.com',
//           'https://*.mapbox.com',
//           'https://*.cloudflare.com/',
//           'https://bundle.js:*',
//           'ws://127.0.0.1:*/',
//         ],
//         upgradeInsecureRequests: [],
//       },
//     },
//   })
// );

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

app.use(cookieParser());

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
  console.log(req.cookies);
  next();
});

// 2 ROUTES

app.use('/', viewRouter);
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
