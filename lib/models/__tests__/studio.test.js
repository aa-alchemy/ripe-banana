const Studio = require('../studio');

describe('Studio model', () => {
  it('validates correct studio model', () => {
    const studioModel = {
      name: 'AA',
      address: {
        city: 'Portland',
        state: 'Oregon',
        country: 'USA'
      }
    };

    const studio = new Studio(studioModel);
    const errors = studio.validateSync();
    expect(errors).toBeUndefined();

    const json = studio.toJSON();

    expect(json).toEqual({
      ...studioModel,
      _id: expect.any(Object)
    });
  });
  it('validates required properties', () => {
    const data = {};
    const studio = new Studio(data);
    const err = studio.validateSync().errors;
    expect(err.name.kind).toBe('required');
  });
});