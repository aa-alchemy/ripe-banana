const mongoose = require('mongoose');
// const Schema = mongoose.Schema;
const { Schema } = mongoose;
const { RequiredString } = require('./temp-required-types');

const schema = new Schema({
  name: RequiredString,
  type: { type: String },
  lives: {
    type: Number,
    required: true,
    min: 0,
    max: 9
  },
  hasSidekick: {
    type: Boolean,
    default: false
  },
  media: [{
    type: String,
    enum: ['movies', 'comics', 'tv', 'internet']
  }],
  year: {
    type: Number,
    required: true
  }
});

module.exports = mongoose.model('Cat', schema);