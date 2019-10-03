const Film = require('../film');
const mongoose = require('mongoose');

describe('Film model', () => {
  it('validates correct film model', () => {
    const filmModel = {
      title: 'Mulan',
      studio: new mongoose.Types.ObjectId,
      released: 1998,
      cast: [{
        role: 'Heroine',
        actor: new mongoose.Types.ObjectId
      }]
    };

    const film = new Film(filmModel);
    const error = film.validateSync();
    expect(error).toBeUndefined();

    const json = film.toJSON();

    expect(json).toEqual({
      _id: expect.any(Object),
      ...filmModel,
      cast: [{
        ...filmModel.cast[0],
        _id: expect.any(Object),
      }]
    });
  });
  it('validates required properties', () => {
    const data = {
      cast: [{}]
    };
    const film = new Film(data);
    const { errors } = film.validateSync();
    
    expect(errors.title.kind).toBe('required');
    expect(errors.studio.kind).toBe('required');
    expect(errors.released.kind).toBe('required');
    expect(errors['cast.0.actor'].kind).toBe('required');
  });

  it('enforces year as 4 digit max', () => {
    const test = {
      released: 12343
    };
    const film = new Film(test);
    const { errors } = film.validateSync();
    expect(errors.released.kind).toBe('max');
  });
  it('enforces year as 4 digit min', () => {
    const test = {
      released: 123
    };
    const film = new Film(test);
    const { errors } = film.validateSync();
    expect(errors.released.kind).toBe('min');
  });
});


