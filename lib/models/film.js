const mongoose = require('mongoose');

const { Schema } = mongoose;

const schema = new Schema({
  title: {
    type: String,
    required: true
  },
  studio: {
    type: String,
    required: true
  },
  released: {
    type: Number,
    required: true,
    min: 1111,
    max: 9999
  },
  cast: [{
    roll: String,
    actor: {
      type: String,
      required: true
    }
  }]
});

module.exports = mongoose.model('Film', schema);