const Actor = require('../actor');

describe('Actor model', () => {
  it('validates correct actor model', () => {
    const actorModel = {
      name: 'Antonella',
      pob: 'Colombia'
    };

    const actor = new Actor(actorModel);
    const error = actor.validateSync();
    expect(error).toBeUndefined();

    const json = actor.toJSON();

    expect(json).toEqual({
      _id: expect.any(Object),
      ...actorModel
    });
  });
  it('validates required properties', () => {
    const data = {};

    const actor = new Actor(data);
    const { errors } = actor.validateSync();

    expect(errors.name.kind).toBe('required');

  });
});