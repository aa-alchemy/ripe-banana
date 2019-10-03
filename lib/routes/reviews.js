// eslint-disable-next-line new-cap
const router = require('express').Router();
const Review = require('../models/review');
const Film = require('../models/film');

router
  .post('/', (req, res, next) => {
    Review.create(req.body)
      .then(review => res.json(review))
      .catch(next);
  })

  .get('/', (req, res, next) => {
    Review.find()
      .sort({ rating: -1 })
      .limit(100)
      .then(review => res.json(review))
      .catch(next);
  })

  .get('/:id', (req, res, next) => {
    Review.findById(req.params.id)
      .lean()
      .select('-__v -reviewer')
      .populate('films', 'title')
      .then(review => res.json(review))
      .catch(next);
  })
  
  .delete('/:id', (req, res, next) => {
    Review.findByIdAndRemove(req.params.id)
      .then(review => res.json(review))
      .catch(next);
  });

module.exports = router;