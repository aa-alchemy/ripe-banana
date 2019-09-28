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
      expect(review).toMatchInlineSnapshot({
        
      }, `
        Object {
          "__v": 0,
          "_id": "5d8ea636cce28c0beb58d650",
          "film": "5d8ea636cce28c0beb58d64e",
          "rating": 4,
          "review": "adufhsiodhJLBZXc uogdoubjkadb",
          "reviewer": "5d8ea636cce28c0beb58d64b",
        }
      `);
    });
  });
});
