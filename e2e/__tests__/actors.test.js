const request = require('../request');
const db = require('../db');

describe('actor api', () => {
  beforeEach(() => {
    return db.dropCollection('actors');
  });

  const aa2Reviewer = {
    name: 'Boss Person',
    company: 'Evil Vampire'
  };

  const aa2Review = {
    rating: 4,
    reviewer: [],
    review: 'adufhsiodhJLBZXc uogdoubjkadb',
    film: []
  };

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
  function postActor(actor) {
    return request
      .post('/api/actors')
      .send(actor)
      .expect(200)
      .then(({ body }) => body);
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

  it('posts an actor', () => {
    return postActor(aa2Actor).then(actor => {
      expect(actor).toEqual({
        _id: expect.any(Object),
        __v: 0,
        ...actor
      });
    });
  });

  it('gets all actors', () => {
    return Promise.all([
      postActor(aa2Actor),
      postActor(aa2Actor),
      postActor(aa2Actor)
    ])
      .then(() => {
        return request.get('/api/actors').expect(200);
      })
      .then(({ body }) => {
        expect(body.length).toBe(3);
        expect(body[0]).toEqual({
          _id: expect.any(String),
          name: aa2Actor.name
        });
      });
  });

  it('gets actor by id', () => {
    return postFilm(aa2Film).then(film => {
      console.log(film.cast[0].actor);
      return request
        .get(`/api/actors/${film.cast[0].actor}`)
        .expect(200)
        .then(({ body }) => {
          expect(body).toMatchInlineSnapshot(`
            Object {
              "_id": "5d927289a589fdee06f0d62b",
              "films": Array [
                Object {
                  "_id": "5d927289a589fdee06f0d62c",
                  "title": "AA2 Alchemist",
                },
              ],
              "name": "Antonella",
              "pob": "Colombia",
            }
          `);
        });
    });
  });

  it('deletes an actor', () => {
    return postActor(aa2Actor).then(actor => {
      return request.delete(`/api/actors/${actor._id}`).expect(200);
    });
  });
});
