const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
  name: {
    type: 'string',
    required: [true, 'Specify a name for the tour'],
    unique: true,
    trim: true,
  },
  duration: {
    type: Number,
    required: [true, 'Specify a duration for the tour'],
  },
  maxGroupSize: {
    type: Number,
    required: [true, 'Specify a maximum group size for the tour'],
  },
  difficulty: {
    type: String,
    required: [true, 'Specify a difficulty for the tour'],
  },
  ratingsAverage: {
    type: Number,
    default: 4.5,
  },
  ratingsQuantity: {
    type: Number,
    default: 0,
  },
  price: {
    type: 'Number',
    required: [true, 'Specify a price for the tour'],
  },
  priceDiscount: Number,
  summary: {
    type: String,
    trim: true,
    required: [true, 'Specify a summary for the tour'],
  },
  description: {
    type: String,
    trim: true,
  },
  imageCover: {
    type: String,
    required: [true, 'Specify a imageCover for the tour'],
  },
  images: [String],
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false,
  },
  startDates: [Date],
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
