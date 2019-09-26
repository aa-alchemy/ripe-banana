const mongoose = require('mongoose');
const { Schema } = mongoose;
const { ObjectId } = Schema.Types;
const { RequiredString, RequiredDate } = require('./temp-required-types');

const schema = new Schema({
  name: RequiredString,
  address: {
    street: RequiredString,
    city: RequiredString,
    state: {
      ...RequiredString,
      enum: ['OR', 'WA', 'CA']
    },
    zip: RequiredString
  },
  shows: [{
    show: {
      type: ObjectId,
      ref: 'Show',
      required: true
    },
    date: RequiredDate
  }]
});

module.exports = mongoose.model('Location', schema);