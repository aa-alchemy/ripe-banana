const request = require('../request');
const db = require('../db');

describe('studio api', () =>{
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
});