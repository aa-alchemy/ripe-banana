const mongoose = require('mongoose');
const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const schema = new Schema({
  title: {
    type: String,
    required: true
  },
  cats: [{
    type: ObjectId,
    ref: 'Cat'
  }],
  locations: [{
    location: {
      type: ObjectId,
      ref: 'Location',
      required: true
    },
    date: {
      type: Date,
      required: true
    }
  }]
});

module.exports = mongoose.model('Show', schema);