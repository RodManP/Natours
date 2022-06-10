const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
  name: {
    type: 'string',
    required: [true, 'Specify a name for the tour'],
    unique: true,
  },
  rating: {
    type: Number,
    default: 4.5,
  },
  price: {
    type: 'Number',
    required: [true, 'Specify a price for the tour'],
  },
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
