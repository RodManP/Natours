const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');

// USER ROUTE HANDLERS
exports.getAllUsers = catchAsync(async (req, res) => {
  const users = await User.find();
  // SEND RESPONSE
  res.status(200).json({
    status: 'success',
    results: users.length,
    data: { users },
  });
});

exports.getUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'to be defined',
  });
};

exports.createUser = (req, res) => {
  res.status(500).json({ status: 'error', message: 'to be defined' });
};

exports.updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'to be defined',
  });
};

exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'to be defined',
  });
};
