'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Album = mongoose.model('Album'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Album
 */
exports.create = function(req, res) {
  var album = new Album(req.body);
  album.user = req.user;

  album.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(album);
    }
  });
};

/**
 * Show the current Album
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var album = req.album ? req.album.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  album.isCurrentUserOwner = req.user && album.user && album.user._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(album);
};

/**
 * Update a Album
 */
exports.update = function(req, res) {
  var album = req.album ;

  album = _.extend(album , req.body);

  album.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(album);
    }
  });
};

/**
 * Delete an Album
 */
exports.delete = function(req, res) {
  var album = req.album ;

  album.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(album);
    }
  });
};

/**
 * List of Albums
 */
exports.list = function(req, res) { 
  Album.find().sort('-created').populate('user', 'displayName').exec(function(err, albums) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(albums);
    }
  });
};

/**
 * Album middleware
 */
exports.albumByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Album is invalid'
    });
  }

  Album.findById(id).populate('user', 'displayName').exec(function (err, album) {
    if (err) {
      return next(err);
    } else if (!album) {
      return res.status(404).send({
        message: 'No Album with that identifier has been found'
      });
    }
    req.album = album;
    next();
  });
};
