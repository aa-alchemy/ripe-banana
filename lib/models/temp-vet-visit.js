const mongoose = require('mongoose');
const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const schema = new Schema({
  score: {
    type: Number,
    required: true
  },
  cat: {
    type: ObjectId,
    ref: 'Cat'
  }
});

module.exports = mongoose.model('VetVisit', schema);
