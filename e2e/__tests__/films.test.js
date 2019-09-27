const request = require('../request');
const mongoose = require('mongoose');
const db = require('../db');

describe('film api', () => {
  beforeEach(() => {
    return Promise.all([
      db.dropCollection('films'),
      db.dropCollection('studios')
    ]);
  });

  const aa2Studio = {
    name: 'AA2',
    address: {
      city: 'Portland',
      state: 'Oregon',
      country: 'USA'
    }
  };

  const aa2Film = {
    title: 'AA2 Alchemist',
    studio: [],
    released: 2019,
    cast: [{
      role: 'Lead Alchemist',
      actor: []
    }]
  };

  function postFilm(aa2Film) {
    return request
      .post('/api/studios')
      .send(aa2Studio)
      .expect(200)
      .then(({ body }) => {
        aa2Film.studio[0] = body._id;
        return request  
          .post('/api/films')
          .send(aa2Film)
          .expect(200);
      })
      .then(({ body }) => body);

  }

  it('posts a film', () => {
    return postFilm(aa2Film)
      .then(film => {
        expect(film).toMatchInlineSnapshot();
      });
  });

});