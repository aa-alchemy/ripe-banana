const request = require('../request');
const db = require('../db');

describe('reviewer api', () => {
  beforeEach(() => {
    db.dropCollection('reviewers');
  });

  const aa2Reviewer = {
    name: 'Boss Person',
    company: 'Evil Vampire'
  };

  const aa2Review = {
    rating: 4,
    reviewer: [],
    review: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
    film: []
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

  const aa2Studio = {
    name: 'AA2',
    address: {
      city: 'Portland',
      state: 'Oregon',
      country: 'USA'
    }
  };

  const aa2Actor = {
    name: 'Antonella',
    pob: 'Colombia'
  };

  function postReviewer(reviewer) {
    return request
      .post('/api/reviewers')
      .send(reviewer)
      .expect(200)
      .then(({ body }) => body);
  }

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

  it('posts a reviewer', () => {
    return postReviewer(aa2Reviewer).then(reviewer => {
      expect(reviewer).toEqual({
        _id: expect.any(Object),
        __v: 0,
        ...reviewer
      });
    });
  });

  it('gets all reviewers', () => {
    return Promise.all([
      postReviewer(aa2Reviewer),
      postReviewer(aa2Reviewer),
      postReviewer(aa2Reviewer)
    ])
      .then(() => {
        return request.get('/api/reviewers').expect(200);
      })
      .then(({ body }) => {
        expect(body.length).toBe(3);
        expect(body[0]).toEqual({
          _id: expect.any(String),
          __v: 0,
          name: aa2Reviewer.name,
          company: aa2Reviewer.company
        });
      });
  });

  it('gets reviewer by id', () => {
    return postReview(aa2Review).then(review => {
      return request
        .get(`/api/reviewers/${review.reviewer}`)
        .expect(200)
        .then(({ body }) => {
          expect(body).toMatchInlineSnapshot(
            {
              _id: expect.any(String),
              reviews: [
                {
                  _id: expect.any(String),
                  film: {
                    _id: expect.any(String)
                  }
                }
              ]
            },
            `
            Object {
              "_id": Any<String>,
              "company": "Evil Vampire",
              "name": "Boss Person",
              "reviews": Array [
                Object {
                  "_id": Any<String>,
                  "film": Object {
                    "_id": Any<String>,
                    "title": "AA2 Alchemist",
                  },
                  "rating": 4,
                  "review": "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
                },
              ],
            }
          `
          );
        });
    });
  });

  it('modifies the reviewer', () => {
    return postReviewer(aa2Reviewer)
      .then(reviewer => {
        reviewer.name = 'this has changed!';
        return request
          .put(`/api/reviewers/${reviewer._id}`)
          .send(reviewer)
          .expect(200);
      })
      .then(({ body }) => {
        expect(body.name).toBe('this has changed!');
      });
  });

  it('finds and deletes by id', () => {
    return postReviewer(aa2Reviewer)
      .then(reviewer => {
        return request.delete(`/api/reviewers/${reviewer._id}`).expect(200);
      })
      .then(() => {
        return request
          .get('/api/reviewers')
          .expect(200)
          .then(({ body }) => {
            expect(body.length).toBe(0);
          });
      });
  });
});
