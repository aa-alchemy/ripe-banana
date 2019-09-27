const mongoose = require('mongoose');

const { Schema } = mongoose;

const schema = new Schema({
  title: {
    type: String,
    required: true
  },
  studio: {
    ref: 'Studio',
    type: mongoose.Types.ObjectId,
    required: true
  },
  released: {
    type: Number,
    required: true,
    min: 1111,
    max: 9999
  },
  cast: [{
    role: String,
    actor: {
      ref: 'Actor',
      type: mongoose.Types.ObjectId,
      required: true
    }
  }]
});

module.exports = mongoose.model('Film', schema);