const Location = require('../temp-location');
const { ObjectId } = require('mongoose').Types;

describe('Location model', () => {

  it('valid model all properties', () => {
    const data = {
      name: 'Main Plaza',
      address: {
        street: '123 Main St',
        city: 'Main Town',
        state: 'OR',
        zip: '12345'
      },
      shows: [{
        show: new ObjectId(),
        date: new Date()
      }]
    };

    const location = new Location(data);
    const errors = location.validateSync();
    expect(errors).toBeUndefined();

    const json = location.toJSON();

    expect(json).toEqual({
      ...data,
      shows: [{
        _id: expect.any(Object),
        ...data.shows[0]
      }],
      _id: expect.any(Object),
    });
  });

  it('validates required properties', () => {
    const data = {
      shows: [{}]
    };
    const location = new Location(data);
    const { errors } = location.validateSync();
    expect(errors.name.kind).toBe('required');
    expect(errors['address.street'].kind).toBe('required');
    expect(errors['address.city'].kind).toBe('required');
    expect(errors['address.state'].kind).toBe('required');
    expect(errors['address.zip'].kind).toBe('required');
    expect(errors['shows.0.show'].kind).toBe('required');
    expect(errors['shows.0.date'].kind).toBe('required');
  });

});