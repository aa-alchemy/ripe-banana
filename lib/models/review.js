const mongoose = require('mongoose');

const { Schema } = mongoose;

const schema = new Schema({
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  reviewer: {
    ref: 'Reviewer',
    type: mongoose.Types.ObjectId,
    required: true
  },
  review: {
    type: String,
    required: true,
    maxlength: 140
  },
  film: {
    ref: 'Film',
    type: mongoose.Types.ObjectId,
    required: true
  }
});

module.exports = mongoose.model('Review', schema);