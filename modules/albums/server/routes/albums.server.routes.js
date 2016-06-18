'use strict';

/**
 * Module dependencies
 */
var albumsPolicy = require('../policies/albums.server.policy'),
  albums = require('../controllers/albums.server.controller');

module.exports = function(app) {
  // Albums Routes
  app.route('/api/albums').all(albumsPolicy.isAllowed)
    .get(albums.list)
    .post(albums.create);

  app.route('/api/albums/:albumId').all(albumsPolicy.isAllowed)
    .get(albums.read)
    .put(albums.update)
    .delete(albums.delete);

  // Finish by binding the Album middleware
  app.param('albumId', albums.albumByID);
};
