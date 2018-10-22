const path = require('path');
const rootPath = path.normalize(__dirname + '/..');
const env = process.env.NODE_ENV || 'development';

const config = {
  development: {
    root: rootPath,
    app: {
      name: 'contactmanagement'
    },
    port: process.env.PORT || 3000,
    db: 'mongodb://localhost/contactmanagement-development'
  },

  test: {
    root: rootPath,
    app: {
      name: 'contactmanagement'
    },
    port: process.env.PORT || 3000,
    db: 'mongodb://localhost/contactmanagement-test'
  },

  production: {
    root: rootPath,
    app: {
      name: 'contactmanagement'
    },
    port: process.env.PORT || 3000,
    db: 'mongodb://localhost/contactmanagement-production'
  }
};

module.exports = config[env];
