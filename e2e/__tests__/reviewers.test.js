const request = require('../request');
const db = require('../db');

describe('reviewer api', () => {
  beforeEach(() => {
    db.dropCollection('reviewers');
  });

  const aa2Reviewer = {
    name: 'Boss Person',
    company: 'Evil Vampire',
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
        expect(body[0]).toEqual({
          _id: expect.any(String),
          name: aa2Reviewer.name,
          company: aa2Reviewer.company
        });
      });
  });

  it('gets reviewer by id', () => {
    return postReviewer(aa2Reviewer)
      .then(reviewer => {
        return request
          .get(`/api/reviewers/${reviewer._id}`)
          .expect(200)
          .then(({ body }) => {
            expect(body).toEqual({
              ...aa2Reviewer,
              _id: expect.any(String)
            });
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



