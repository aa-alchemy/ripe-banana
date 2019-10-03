const Reviewer = require('../reviewer');

describe('reviewer model', () => {
  it('validates correct reviewer model', () => {
    const reviewerModel = {
      name: 'Boss Person',
      company: 'Evil Vampire'
    };

    const reviewer = new Reviewer(reviewerModel);
    const errors = reviewer.validateSync();
    expect(errors).toBeUndefined();

    const json = reviewer.toJSON();

    expect(json).toEqual({
      ...reviewerModel,
      _id: expect.any(Object)
    });
  });

  it('validates required properties', () => {
    const data = {};
    const reviewer = new Reviewer(data);
    const { errors } = reviewer.validateSync();

    expect(errors.company.kind).toBe('required');
    expect(errors.name.kind).toBe('required');
  });
});