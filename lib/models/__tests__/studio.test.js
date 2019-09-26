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

    expect(json).toBe({
      ...studioModel,
      _id: expect.any(String)
    });
  });
});