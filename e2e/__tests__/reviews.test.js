const request = require('../request');
const db = require('../db');

describe('review api', () => {
  beforeEach(() => {
    return Promise.all([
      db.dropCollection('reviews'),
      db.dropCollection('films'),
      db.dropCollection('reviewers')
    ]);
  });

  const aa2Reviewer = {
    name: 'Boss Person',
    company: 'Evil Vampire'
  };

  const aa2Review = {
    rating: 4,
    reviewer: [],
    review: 'adufhsiodhJLBZXc uogdoubjkadb',
    film: []
  };

  const aa2Studio = {
    name: 'AA2',
    address: {
      city: 'Portland',
      state: 'Oregon',
      country: 'USA'
    }
  };

  const aa2Film = {
    title: 'AA2 Alchemist',
    studio: [],
    released: 2019,
    cast: [
      {
        role: 'Lead Alchemist',
        actor: []
      }
    ]
  };

  const aa2Actor = {
    name: 'Antonella',
    pob: 'Colombia'
  };

  function postReview(aa2Review) {
    
  }
  
})