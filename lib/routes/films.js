// eslint-disable-next-line new-cap
const router = require('express').Router();
const Film = require('../models/film');

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
    Film.findById(req.params.id)
      .select('-__v -_id')
      .populate('studios', 'name')
      .then(film => res.json(film))
      .catch(next);
  })
  .delete('/:id', (req, res, next) => {
    Film.findByIdAndRemove(req.params.id)
      .then(deleted => res.json(deleted))
      .catch(next);
  });

module.exports = router;