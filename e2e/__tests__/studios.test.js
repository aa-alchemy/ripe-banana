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
    },
    films: []
  };

  function postStudio(studio) {
    return request
      .post('/api/studios')
      .send(studio)
      .expect(200)
      .then(({ body }) => body);
  }

  it('posts a studio', () => {
    return postStudio(aa2Studio).then(studio => {
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
        return request.get('/api/studios').expect(200);
      })
      .then(({ body }) => {
        expect(body.length).toBe(3);
        expect(body[0]).toEqual({
          _id: expect.any(String),
          name: aa2Studio.name
        });
      });
  });

  it('gets studio by id', () => {
    return postStudio(aa2Studio).then(studio => {
      return request
        .post(`/api/films`)
        .send({
          title: 'Testing',
          studio: studio._id,
          released: 2019
        })
        .expect(200)
        .then(() => {
          return request.get(`/api/studios/${studio._id}`).expect(200);
        })
        .then(({ body }) => {
          expect(body).toMatchInlineSnapshot(
            {
              _id: expect.any(String),
              films: [{
                _id: expect.any(String) 
              }]
            },
            `
            Object {
              "__v": 0,
              "_id": Any<String>,
              "address": Object {
                "city": "Portland",
                "country": "USA",
                "state": "Oregon",
              },
              "films": Array [
                Object {
                  "_id": Any<String>,
                  "title": "Testing",
                },
              ],
              "name": "AA2",
            }
          `
          );
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
