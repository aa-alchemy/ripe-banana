// eslint-disable-next-line new-cap
const router = require('express').Router();
const Reviewer = require('../models/reviewer');
const Review = require('../models/review');

router
  .post('/', (req, res, next) => {
    Reviewer.create(req.body)
      .then(reviewer => res.json(reviewer))
      .catch(next);
  })
  .get('/', (req, res, next) => {
    Reviewer.find()
      .select('-__v')
      .then(reviewer => res.json(reviewer))
      .catch(next);
  })
  .get('/:id', (req, res, next) => {
    Promise.all([
      Reviewer.findById(req.params.id)
        .select('-__v')
        .lean(),
      Review.find({ reviewer: req.params.id })
        .select('rating review film')
        .populate('film', 'title')
        .lean()
    ])
      .then(([reviewer, reviews]) => {
        reviewer.reviews = reviews;
        res.json(reviewer);
      })
      .catch(next);
  })

  .put('/:id', (req, res, next) => {
    Reviewer.findByIdAndUpdate(
      req.params.id, 
      req.body,
      { new: true }
    )
      .then(reviewer => res.json(reviewer))
      .catch(next);
  })

  .delete('/:id', (req, res, next) => {
    Reviewer.findByIdAndRemove(req.params.id)
      .then(reviewer => res.json(reviewer))
      .catch(next);
  });

module.exports = router;