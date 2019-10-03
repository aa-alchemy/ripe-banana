const request = require('../request');
const db = require('../db');

describe('review api', () => {
  beforeEach(() => {
    return Promise.all([
      db.dropCollection('reviews'),
      db.dropCollection('films'),
      db.dropCollection('reviewers')
    ]);
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
  it('posts a review', () => {
    return postReview(aa2Review).then(review => {
      expect(review).toMatchInlineSnapshot(
        {
          _id: expect.any(String),
          film: expect.any(String),
          reviewer: expect.any(String)
        },
        `
        Object {
          "__v": 0,
          "_id": Any<String>,
          "film": Any<String>,
          "rating": 4,
          "review": "adufhsiodhJLBZXc uogdoubjkadb",
          "reviewer": Any<String>,
        }
      `
      );
    });
  });
  it('gets all reviews', () => {
    return Promise.all([
      postReview(aa2Review),
      postReview(aa2Review),
      postReview(aa2Review)
    ])
      .then(() => {
        return request.get('/api/reviews').expect(200);
      })
      .then(({ body }) => {
        expect(body.length).toBe(3);
      });
  });

  it('gets review by an id', () => {
    return postReview(aa2Review).then(review => {
      return request
        .get(`/api/reviews/${review._id}`)
        .expect(200)
        .then(({ body }) => {
          expect(body).toMatchInlineSnapshot(
            {
              _id: expect.any(String),
              film: {
                _id: expect.any(String)
              },
              reviewer: expect.any(String)
            },
            `
            Object {
              "_id": Any<String>,
              "film": Object {
                "_id": Any<String>,
                "title": "AA2 Alchemist",
              },
              "rating": 4,
              "review": "adufhsiodhJLBZXc uogdoubjkadb",
              "reviewer": Any<String>,
            }
          `
          );
        });
    });
  });

  it('finds by id and deletes', () => {
    return postReview(aa2Review)
      .then(review => {
        return request.delete(`/api/reviews/${review._id}`).expect(200);
      })
      .then(() => {
        return request
          .get('/api/reviews')
          .expect(200)
          .then(({ body }) => {
            expect(body.length).toBe(0);
          });
      });
  });
});
