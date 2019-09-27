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

  function postReviewer(reviewer) {
    return request
      .post('/api/reviewers')
      .send(reviewer)
      .expect(200)
      .then(({ body }) => body);
  }

  it('posts a reviewer', () => {
    return postReviewer(aa2Reviewer)
      .then(reviewer => {
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
        return request
          .get('/api/reviewers')
          .expect(200);
      })
      .then(({ body }) => {
        expect(body.length).toBe(3);
      });
  });

  it('gets reviewer by id', () => {
    return postReviewer(aa2Reviewer)
      .then(reviewer => {
        return request
          .get(`/api/reviewers/${reviewer._id}`)
          .expect(200)
          .then(({ body }) => {
            expect(body).toEqual(reviewer);
          });
      });
  });

  it('finds and deletes by id', () => {
    return postReviewer(aa2Reviewer)
      .then(reviewer => {
        return request
          .delete(`/api/reviewers/${reviewer._id}`)
          .expect(200);
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



