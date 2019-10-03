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

  const aa2Reviewer = {
    name: 'testing',
    company: 'test company'
  };

  const aa2Review = {
    rating: 4,
    reviewer: [],
    review: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
    film: []
  };

  const aa2Actor = {
    name: 'Antonella',
    pob: 'Colombia'
  };

  function postReview(aa2Review) {
    return request
      .post('/api/reviewers')
      .send(aa2Reviewer)
      .expect(200)
      .then(({ body }) => {
        aa2Review.reviewer = body._id;
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
                  .then(({ body }) => {
                    aa2Review.film = body._id;
                    return request
                      .post('/api/reviews')
                      .send(aa2Review)
                      .expect(200)
                      .then(({ body }) => body);
                  });
              });
          });
      });
  }

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
              _id: expect.any(String),
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
              "_id": Any<String>,
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
    return postReview(aa2Review).then(review => {
      return request
        .get(`/api/films/${review.film}`)
        .expect(200)
        .then(({ body }) => {
          expect(body).toMatchInlineSnapshot(
            {
              _id: expect.any(String),
              cast: [
                {
                  _id: expect.any(String),
                  actor: {
                    _id: expect.any(String)
                  }
                }
              ],
              reviews: [
                {
                  _id: expect.any(String),
                  reviewer: {
                    _id: expect.any(String)
                  }
                }
              ],
              studio: {
                _id: expect.any(String)
              }
            },
            `
            Object {
              "_id": Any<String>,
              "cast": Array [
                Object {
                  "_id": Any<String>,
                  "actor": Object {
                    "_id": Any<String>,
                    "name": "Antonella",
                  },
                  "role": "Lead Alchemist",
                },
              ],
              "released": 2019,
              "reviews": Array [
                Object {
                  "_id": Any<String>,
                  "rating": 4,
                  "review": "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
                  "reviewer": Object {
                    "_id": Any<String>,
                    "name": "testing",
                  },
                },
              ],
              "studio": Object {
                "_id": Any<String>,
                "name": "AA2",
              },
              "title": "AA2 Alchemist",
            }
          `
          );
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
