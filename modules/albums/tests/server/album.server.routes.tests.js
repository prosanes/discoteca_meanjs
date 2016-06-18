'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Album = mongoose.model('Album'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, album;

/**
 * Album routes tests
 */
describe('Album CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new Album
    user.save(function () {
      album = {
        name: 'Album name'
      };

      done();
    });
  });

  it('should be able to save a Album if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Album
        agent.post('/api/albums')
          .send(album)
          .expect(200)
          .end(function (albumSaveErr, albumSaveRes) {
            // Handle Album save error
            if (albumSaveErr) {
              return done(albumSaveErr);
            }

            // Get a list of Albums
            agent.get('/api/albums')
              .end(function (albumsGetErr, albumsGetRes) {
                // Handle Album save error
                if (albumsGetErr) {
                  return done(albumsGetErr);
                }

                // Get Albums list
                var albums = albumsGetRes.body;

                // Set assertions
                (albums[0].user._id).should.equal(userId);
                (albums[0].name).should.match('Album name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Album if not logged in', function (done) {
    agent.post('/api/albums')
      .send(album)
      .expect(403)
      .end(function (albumSaveErr, albumSaveRes) {
        // Call the assertion callback
        done(albumSaveErr);
      });
  });

  it('should not be able to save an Album if no name is provided', function (done) {
    // Invalidate name field
    album.name = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Album
        agent.post('/api/albums')
          .send(album)
          .expect(400)
          .end(function (albumSaveErr, albumSaveRes) {
            // Set message assertion
            (albumSaveRes.body.message).should.match('Please fill Album name');

            // Handle Album save error
            done(albumSaveErr);
          });
      });
  });

  it('should be able to update an Album if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Album
        agent.post('/api/albums')
          .send(album)
          .expect(200)
          .end(function (albumSaveErr, albumSaveRes) {
            // Handle Album save error
            if (albumSaveErr) {
              return done(albumSaveErr);
            }

            // Update Album name
            album.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Album
            agent.put('/api/albums/' + albumSaveRes.body._id)
              .send(album)
              .expect(200)
              .end(function (albumUpdateErr, albumUpdateRes) {
                // Handle Album update error
                if (albumUpdateErr) {
                  return done(albumUpdateErr);
                }

                // Set assertions
                (albumUpdateRes.body._id).should.equal(albumSaveRes.body._id);
                (albumUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Albums if not signed in', function (done) {
    // Create new Album model instance
    var albumObj = new Album(album);

    // Save the album
    albumObj.save(function () {
      // Request Albums
      request(app).get('/api/albums')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Album if not signed in', function (done) {
    // Create new Album model instance
    var albumObj = new Album(album);

    // Save the Album
    albumObj.save(function () {
      request(app).get('/api/albums/' + albumObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', album.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Album with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/albums/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Album is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Album which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Album
    request(app).get('/api/albums/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Album with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Album if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Album
        agent.post('/api/albums')
          .send(album)
          .expect(200)
          .end(function (albumSaveErr, albumSaveRes) {
            // Handle Album save error
            if (albumSaveErr) {
              return done(albumSaveErr);
            }

            // Delete an existing Album
            agent.delete('/api/albums/' + albumSaveRes.body._id)
              .send(album)
              .expect(200)
              .end(function (albumDeleteErr, albumDeleteRes) {
                // Handle album error error
                if (albumDeleteErr) {
                  return done(albumDeleteErr);
                }

                // Set assertions
                (albumDeleteRes.body._id).should.equal(albumSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Album if not signed in', function (done) {
    // Set Album user
    album.user = user;

    // Create new Album model instance
    var albumObj = new Album(album);

    // Save the Album
    albumObj.save(function () {
      // Try deleting Album
      request(app).delete('/api/albums/' + albumObj._id)
        .expect(403)
        .end(function (albumDeleteErr, albumDeleteRes) {
          // Set message assertion
          (albumDeleteRes.body.message).should.match('User is not authorized');

          // Handle Album error error
          done(albumDeleteErr);
        });

    });
  });

  it('should be able to get a single Album that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      username: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local'
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new Album
          agent.post('/api/albums')
            .send(album)
            .expect(200)
            .end(function (albumSaveErr, albumSaveRes) {
              // Handle Album save error
              if (albumSaveErr) {
                return done(albumSaveErr);
              }

              // Set assertions on new Album
              (albumSaveRes.body.name).should.equal(album.name);
              should.exist(albumSaveRes.body.user);
              should.equal(albumSaveRes.body.user._id, orphanId);

              // force the Album to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
                    }

                    // Get the Album
                    agent.get('/api/albums/' + albumSaveRes.body._id)
                      .expect(200)
                      .end(function (albumInfoErr, albumInfoRes) {
                        // Handle Album error
                        if (albumInfoErr) {
                          return done(albumInfoErr);
                        }

                        // Set assertions
                        (albumInfoRes.body._id).should.equal(albumSaveRes.body._id);
                        (albumInfoRes.body.name).should.equal(album.name);
                        should.equal(albumInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Album.remove().exec(done);
    });
  });
});
