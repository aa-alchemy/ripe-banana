const Show = require('../temp-show');
const { ObjectId } = require('mongoose').Types;

describe('Show model', () => {

  it('valid model all properties', () => {
    const data = {
      title: 'Rainbow Cats',
      cats: [new ObjectId()],
      locations: [{
        location: new ObjectId(),
        date: new Date()
      }]
    };

    const show = new Show(data);
    const errors = show.validateSync();
    expect(errors).toBeUndefined();

    const json = show.toJSON();

    expect(json).toEqual({
      ...data,
      locations: [{
        _id: expect.any(Object),
        ...data.locations[0]
      }],
      _id: expect.any(Object),
    });
  });

  it('validates required properties', () => {
    const data = {};
    const show = new Show(data);
    const { errors } = show.validateSync();
    expect(errors.title.kind).toBe('required');
  });

});