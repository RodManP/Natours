const mongoose = require('mongoose');
const slugify = require('slugify');
// const validator = require('validator');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: 'string',
      required: [true, 'Specify a name for the tour'],
      unique: true,
      trim: true,
      maxlength: [40, 'Maximum length of a tour name is 40 characters'],
      minlength: [10, 'Minimum length of a tour name is 10 characters'],
      // validate: [validator.isAlpha, 'Name must have only letters'],
    },
    slug: {
      type: String,
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
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty must be one of: easy, medium or difficult',
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Minimum ratingsAverage is 1'],
      max: [5, 'Maximum ratingsAverage is 5'],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: 'Number',
      required: [true, 'Specify a price for the tour'],
    },
    priceDiscount: {
      type: Number,
      // 'this' points to the doc only in create
      validate: {
        validator: function (val) {
          return val < this.price;
        },
        message: 'Discount {VALUE} should be less than price',
      },
    },
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
    secretTour: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

// DOCUMENT MIDDLEWARE: runs before save and create a document, not for update
tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// tourSchema.pre('save', function (next) {
//   console.log('doc to be saved');
//   next();
// });

// tourSchema.post('save', function (doc, next) {
//   console.log(doc);
//   next();
// });

// QUERY MIDDLEWARE
tourSchema.pre(/^find/, function (next) {
  // tourSchema.pre('find', function (next) {
  this.find({ secretTour: { $ne: true } });
  this.start = Date.now();
  next();
});

tourSchema.post(/^find/, function (docs, next) {
  console.log(`Query took : ${Date.now() - this.start} milliseconds`);
  // console.log(docs);
  next();
});

//AGGREGATION MIDDLEWARE
tourSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  next();
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
