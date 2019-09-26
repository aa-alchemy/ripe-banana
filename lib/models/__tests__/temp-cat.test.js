const Cat = require('../temp-cat');

describe('Cat model', () => {

  it('valid model all properties', () => {
    const data = {
      name: 'felix',
      type: 'tuxedo',
      lives: 9,
      hasSidekick: false,
      media: ['movies', 'comics'],
      year: 1919,
    };

    const cat = new Cat(data);
    const errors = cat.validateSync();
    expect(errors).toBeUndefined();

    const json = cat.toJSON();

    expect(json).toEqual({
      ...data,
      _id: expect.any(Object),
    });
  });

  it('validates required properties', () => {
    const data = {};
    const cat = new Cat(data);
    const { errors } = cat.validateSync();
    expect(errors.name.kind).toBe('required');
    expect(errors.lives.kind).toBe('required');
    expect(errors.year.kind).toBe('required');
  });

  it('populates default properties', () => {
    const data = {
      name: 'felix',
      types: 'tuxedo',
      lives: 9,
      year: 1919,
    };
    const cat = new Cat(data);
    const err = cat.validateSync();
    expect(err).toBeUndefined();

    expect(cat.hasSidekick).toBe(false);
  });

  it('enforces max of 9 lives', () => {
    const data = {
      lives: 10
    };
    const cat = new Cat(data);
    const { errors } = cat.validateSync();
    expect(errors.lives.kind).toBe('max');
  });

  it('enforces min of 0 lives', () => {
    const data = {
      lives: -10
    };
    const cat = new Cat(data);
    const { errors } = cat.validateSync();
    expect(errors.lives.kind).toBe('min');
  });

  it('enforces enum on media', () => {
    const data = {
      media: ['graffiti']
    };
    const cat = new Cat(data);
    const { errors } = cat.validateSync();
    expect(errors['media.0'].kind).toBe('enum');
  });

});