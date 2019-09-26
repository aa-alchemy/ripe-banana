// eslint-disable-next-line new-cap
const router = require('express').Router();
const Studio = require('../models/studio');

router
  .post('/', (req, res, next) => {
    Studio.create(req.body)
      .then(studio => studio.toJSON(studio))
      .catch(next);
  });

module.exports = router;