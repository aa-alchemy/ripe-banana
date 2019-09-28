# LAB - 08

## Ripe Banana

### Author: Antonella Gutierrez, Alex Spencer

### Links and Resources
* [submission PR](https://github.com/aa-alchemy/ripe-banana/pull/1)
* [travis](https://travis-ci.com/aa-alchemy/ripe-banana/builds/129527995)
* [back-end](https://alex-antonella-ripe-banana.herokuapp.com/)

### Setup
#### `.env` requirements
* `PORT` - Port Number
* `MONGODB_URI` - URL to the running mongo instance/db

#### Running the app

**Describe what npm scripts do**
* scripts:
  - "lint": "eslint .",
  - "pretest": "npm run lint",
  - "jest": "jest --runInBand",
  - "test": "npm run jest -- --coverage",
  - "test:watch": "npm run jest -- --watchAll",
  - "test:verbose": "npm run test -- --verbose",
  - "start": "node server.js",
  - "start:watch": "nodemon server.js",
  - "load:cats": "mongoimport --db famous-cats --collection cats --drop --jsonArray --file ./data/cats.json"
  