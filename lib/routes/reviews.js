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
      .select('_id rating review')
      .populate('film', 'title')
      .then(review => res.json(review))
      .catch(next);
  })

  .get('/:id', (req, res, next) => {
    Review.findById(req.params.id)
      .select('-__v')
      .lean()
      .populate('film', 'title')
      .then(review => res.json(review))
      .catch(next);
  })
  
  .delete('/:id', (req, res, next) => {
    Review.findByIdAndRemove(req.params.id)
      .then(review => res.json(review))
      .catch(next);
  });

module.exports = router;