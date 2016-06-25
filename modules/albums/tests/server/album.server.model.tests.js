'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Album = mongoose.model('Album'),
  Artist = mongoose.model('Artist');

/**
 * Globals
 */
var user, artist, album;

/**
 * Unit tests
 */
describe('Album Model Unit Tests:', function() {
  beforeEach(function(done) {
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: 'username',
      password: 'password'
    });

    user.save(function() { 
      artist = new Artist({
        name: 'Artist Name',
        user: user
      });

      artist.save(function() {
        album = new Album({
          title: 'Album Title',
          artist: artist,
          user: user
        });

        done();
      });
    });
  });

  describe('Method Save', function() {
    it('should be able to save without problems', function(done) {
      this.timeout(0);
      return album.save(function(err) {
        should.not.exist(err);
        done();
      });
    });

    it('should be able to show an error when try to save without name', function(done) { 
      album.title = '';

      return album.save(function(err) {
        should.exist(err);
        done();
      });
    });
  });

  afterEach(function(done) { 
    Album.remove().exec(function(){
      User.remove().exec(function(){
        done();  
      });
    });
  });
});
