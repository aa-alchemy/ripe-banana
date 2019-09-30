const request = require('../request');
const db = require('../db');

describe('actor api', () => {
  beforeEach(() => {
    return db.dropCollection('actors');
  });

  const aa2Actor = {
    name: 'Antonella',
    pob: 'Colombia',
    films: []
  };

  function postActor(actor) {
    return request
      .post('/api/actors')
      .send(actor)
      .expect(200)
      .then(({ body }) => body);
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
    return postActor(aa2Actor).then(actor => {
      return request
        .get(`/api/actors/${actor._id}`)
        .expect(200)
        .then(({ body }) => {
          expect(body).toMatchInlineSnapshot(
            {
              _id: expect.any(String)
            },
            `
            Object {
              "_id": Any<String>,
              "name": "Antonella",
              "pob": "Colombia",
            }
          `
          );
        });
    });
  });

  it('deletes an actor', () => {
    return postActor(aa2Actor).then(actor => {
      return request.delete(`/api/actors/${actor._id}`).expect(200);
    });
  });
});
