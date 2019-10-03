// eslint-disable-next-line new-cap
const router = require('express').Router();
const Actor = require('../models/actor');
const Film = require('../models/film');

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
    Promise.all([
      Actor.findById(req.params.id)
        .lean()
        .select('-__v'),
      Film.where('cast.actor', req.params.id)
        .select('title')
        .lean()
    ])
      .then(([actor, films]) => {
        actor.films = films;
        res.json(actor);
      })
      .catch(next);
  })

  .delete('/:id', (req, res, next) => {
    Film.exists({ 'cast.actor': req.params.id })
      .then(exists => {
        if(exists) throw {
          statusCode: 400,
          error: 'Can\'t delete an actor that is part of a released film'
        };
        Actor.findByIdAndRemove(req.params.id);
      })
      .then(deleted => res.json(deleted))
      .catch(next);
  });

module.exports = router;