const Review = require('../review');
const mongoose = require('mongoose');

describe('Review model', () => {
  it('validates correct review model', () => {
    const reviewModel = {
      rating: 4,
      reviewer: new mongoose.Types.ObjectId,
      review: 'adufhsiodhJLBZXc uogdoubjkadb',
      film: new mongoose.Types.ObjectId
    };
  
    const review = new Review(reviewModel);
    const error = review.validateSync();
    expect(error).toBeUndefined();
  
    const json = review.toJSON();
  
    expect(json).toEqual({
      _id: expect.any(Object),
      ...reviewModel
    });
  });

  it('validates required properties', () => {
    const data = {};
    const review = new Review(data);
    const { errors } = review.validateSync();

    expect(errors.rating.kind).toBe('required');
    expect(errors.reviewer.kind).toBe('required');
    expect(errors.review.kind).toBe('required');
    expect(errors.film.kind).toBe('required');
  });

  it('expects a min of 1', () => {
    const test = {
      rating: 0
    };
    const review = new Review(test);
    const { errors } = review.validateSync();
    expect(errors.rating.kind).toBe('min');
  });

  it('expects a max of 5', () => {
    const test = {
      rating: 6
    };
    const review = new Review(test);
    const { errors } = review.validateSync();
    expect(errors.rating.kind).toBe('max');
  });

  it('expects a max character length of review to be 140', () => {
    const test = {
      review: 'asdhadhadshasdhasdhasdhadhashasdhadhasdhasdhadshasdhasdhadhasdhasdhasdhadshasdhasdhasdhadhasdhasdhasdhasdhasdhasdhdahasdhasdhadshadhadshasdhadhasdhah'
    };
    const review = new Review(test);
    const { errors } = review.validateSync();
    expect(errors.review.kind).toBe('maxlength');
  });
});