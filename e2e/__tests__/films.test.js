const request = require('../request');
const mongoose = require('mongoose');
const db = require('../db');

describe('film api', () => {
  beforeEach(() => {
    return Promise.all([
      db.dropCollection('films'),
      db.dropCollection('studios'),
      db.dropCollection('actors')
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
    cast: [
      {
        role: 'Lead Alchemist',
        actor: []
      }
    ]
  };

  const aa2Actor = {
    name: 'Antonella',
    pob: 'Colombia'
  };

  function postFilm(aa2Film) {
    return request
      .post('/api/studios')
      .send(aa2Studio)
      .expect(200)
      .then(({ body }) => {
        aa2Film.studio[0] = body._id;
        return request
          .post('/api/actors')
          .send(aa2Actor)
          .expect(200)
          .then(({ body }) => {
            aa2Film.cast[0].actor = body._id;
            return request
              .post('/api/films')
              .send(aa2Film)
              .expect(200)
              .then(({ body }) => body);
          });
      });
  }

  it('posts a film', () => {
    return postFilm(aa2Film).then(film => {
      expect(film).toMatchInlineSnapshot(`
        Object {
          "__v": 0,
          "_id": "5d8e7ca53c90f5a0a2564052",
          "cast": Array [
            Object {
              "_id": "5d8e7ca53c90f5a0a2564053",
              "actor": "5d8e7ca53c90f5a0a2564051",
              "role": "Lead Alchemist",
            },
          ],
          "released": 2019,
          "studio": "5d8e7ca53c90f5a0a2564050",
          "title": "AA2 Alchemist",
        }
      `);
    });
  });
});
