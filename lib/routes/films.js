// eslint-disable-next-line new-cap
const router = require('express').Router();
const Film = require('../models/film');
const Review = require('../models/review');


router 
  .post('/', (req, res, next) => {
    Film.create(req.body)
      .then(film => res.json(film))
      .catch(next);
  })

  .get('/', (req, res, next) => {
    Film.find()
      .select('_id title released')
      .populate('studio', 'name')
      .then(film => res.json(film))
      .catch(next);
  })

  .get('/:id', (req, res, next) => {
    return Promise.all([
      Film.findById(req.params.id)
        .select('-__v')
        .lean()
        .populate('studio', 'name')
        .populate('cast.actor', 'name'),
      Review.find({ film: req.params.id })
        .select('rating review reviewer')
        .populate('reviewer', 'name')
        .lean()
    ])
      .then(([film, reviews]) => {
        film.reviews = reviews;
        res.json(film);
      })
      .catch(next);
  })

  .delete('/:id', (req, res, next) => {
    Film.findByIdAndRemove(req.params.id)
      .then(deleted => res.json(deleted))
      .catch(next);
  });

module.exports = router;