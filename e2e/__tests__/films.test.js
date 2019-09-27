const request = require('../request');
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
      expect(film).toMatchInlineSnapshot(
        {
          _id: expect.any(String),
          studio: expect.any(String),
          cast: [
            {
              actor: expect.any(String)
            }
          ]
        },
        `
        Object {
          "__v": 0,
          "_id": Any<String>,
          "cast": Array [
            Object {
              "_id": "5d8e9281e55c18ac10e06044",
              "actor": Any<String>,
              "role": "Lead Alchemist",
            },
          ],
          "released": 2019,
          "studio": Any<String>,
          "title": "AA2 Alchemist",
        }
      `
      );
    });
  });
  it('gets all films', () => {
    return Promise.all([
      postFilm(aa2Film),
      postFilm(aa2Film),
      postFilm(aa2Film)
    ])
      .then(() => {
        return request.get('/api/films').expect(200);
      })
      .then(({ body }) => {
        expect(body.length).toBe(3);
      });
  });
  it('gets film by its id', () => {
    return postFilm(aa2Film).then(film => {
      return request
        .get(`/api/films/${film._id}`)
        .expect(200)
        .then(({ body }) => {
          expect(body).toEqual(film);
        });
    });
  });
  it('finds by id and deletes', () => {
    return postFilm(aa2Film)
      .then(film => {
        return request.delete(`/api/films/${film._id}`).expect(200);
      })
      .then(() => {
        return request
          .get('/api/films')
          .expect(200)
          .then(({ body }) => {
            expect(body.length).toBe(0);
          });
      });
  });
});
