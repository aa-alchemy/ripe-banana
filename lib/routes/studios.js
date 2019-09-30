// eslint-disable-next-line new-cap
const router = require('express').Router();
const Studio = require('../models/studio');
const Films = require('../models/film');

router
  .post('/', (req, res, next) => {
    Studio.create(req.body)
      .then(studio => res.json(studio))
      .catch(next);
  })

  .get('/', (req, res, next) => {
    Studio.find()
      .lean()
      .select('name')
      .then(studio => res.json(studio))
      .catch(next);
  })

  .get('/:id', (req, res, next) => {
    Promise.all([
      Studio.findById(req.params.id)
        .lean(),
      Films.find({ studio: req.params.id })
        .select('_id title')
        .lean()
    ])
      .then(([studio, films]) => {
        studio.films = films;
        res.json(studio);
      })
      .catch(next);
  })

  .delete('/:id', (req, res, next) => {
    Studio.findByIdAndRemove(req.params.id)
      .then(deleted => res.json(deleted))
      .catch(next);
  });

module.exports = router;