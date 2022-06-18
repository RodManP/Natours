const mongoose = require('mongoose');
const dotenv = require('dotenv');

process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT_EXCEPTION 💣💥 shuting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config({ path: './config.env' });
const app = require('./app');

// console.log(process.env);
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  // .connect(process.env.DATABASE_LOCAL, {
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true, // added by me
  })
  .then(() => {
    console.log('DB connection established');
  });

const port = process.env.PORT || 3000;
//  START SERVER
const server = app.listen(port, () => {
  console.log(`app listening on port ${port}`);
});

process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED_REJECTION 💣💥 shuting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
