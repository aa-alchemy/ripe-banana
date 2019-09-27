const request = require('../request');
const db = require('../db');

describe('studio api', () => {
  beforeEach(() => {
    return db.dropCollection('studios');
  });

  const aa2Studio = {
    name: 'AA2',
    address: {
      city: 'Portland',
      state: 'Oregon',
      country: 'USA'
    }
  };

  function postStudio(studio) {
    return request
      .post('/api/studios')
      .send(studio)
      .expect(200)
      .then(({ body }) => body);
  }

  it('posts a studio', () => {
    return postStudio(aa2Studio)
      .then(studio => {
        expect(studio).toEqual({
          _id: expect.any(Object),
          __v: 0,
          ...studio
        });
      });
  });
  it('it gets all studios', () => {
    return Promise.all([
      postStudio(aa2Studio),
      postStudio(aa2Studio),
      postStudio(aa2Studio)
    ])
      .then(() => {
        return request 
          .get('/api/studios')
          .expect(200);
      })
      .then(({ body }) => {
        expect(body.length).toBe(3);
        expect(body[0]).toEqual({
          _id: expect.any(String),
          name: aa2Studio.name,
          __v: 0,
          address: {
            city: aa2Studio.address.city,
            state: aa2Studio.address.state,
            country: aa2Studio.address.country
          }
        });
      });
  });

  it('gets studio by id', () => {
    return postStudio(aa2Studio)
      .then(studio => {
        return request
          .get(`/api/studios/${studio._id}`)
          .expect(200)
          .then(({ body }) => {
            expect(body).toEqual(studio);
          });
      });
  });

  it('deletes studio', () => {
    return postStudio(aa2Studio)
      .then(studio => {
        return request
          .delete(`/api/studios/${studio._id}`)
          .expect(200);
      })
      .then(() => {
        return request
          .get('/api/studios')
          .expect(200)
          .then(({ body }) => {
            expect(body.length).toBe(0);
          });
      });
  });
});