// eslint-disable-next-line new-cap
const router = require('express').Router();
const Actor = require('../models/actor');

router
  .post('/', (req, res, next) => {
    Actor.create(req.body)
      .then(actor => res.json(actor))
      .catch(next);
  })

  .get('/', (req, res, next) => {
    Actor.find() 
      .lean()
      .select('name')
      .then(actor => res.json(actor))
      .catch(next);
  })

  .get('/:id', (req, res, next) => {
    Actor.findById(req.params.id)
      .select('-__v')
      .then(actor => res.json(actor))
      .catch(next);
  })

  .delete('/:id', (req, res, next) => {
    Actor.findByIdAndRemove(req.params.id)
      .then(deleted => res.json(deleted))
      .catch(next);
  });

module.exports = router;

// .select('__v': false)