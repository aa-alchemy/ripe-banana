const request = require('../request');
const db = require('../db');

describe('actor api', () => {
  beforeEach(() => {
    return db.dropCollection('actors');
  });

  const aa2Actor = {
    name: 'Antonella',
    pob: 'Colombia'
  };

  function postActor(actor) {
    return request
      .post('/api/actors')
      .send(actor)
      .expect(200)
      .then(({ body }) => body);
  }

  it('posts an actor', () => {
    return postActor(aa2Actor)
      .then(actor => {
        expect(actor).toEqual({
          _id: expect.any(Object),
          __v: 0,
          ...actor
        });
      });
  });

});