'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  mongoosastic = require('mongoosastic'),
  Schema = mongoose.Schema,
  ArtistSchema = require('../../../artists/server/models/artist.server.model').ArtistSchema;

/**
 * Album Schema
 */
var AlbumSchema = new Schema({
  title: {
    type: String,
    default: '',
    required: 'Preencha o titulo do album',
    trim: true,
    es_indexed: true
  },
  artist: {
    type: Schema.ObjectId,
    required: 'Escolha um artista',
    ref: 'Artist',
    es_indexed: true,
    es_schema: ArtistSchema,
    es_select: 'name'
  },
  year: {
    type: String
  },
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
}, { autoindex: true });

AlbumSchema.plugin(mongoosastic, {
  indexAutomatically: true,
  populate: [
    {path: 'artist', select: 'name'}
  ]
});

var Album = mongoose.model('Album', AlbumSchema);

if (process.env.NODE_ENV === 'development') {
  // Index existing
  var stream = Album.synchronize();
  var count = 0;

  stream.on('data', function(err, doc){
    count++;
  });
  stream.on('close', function(){
    console.log('indexed ' + count + ' Albums!');
  });
  stream.on('error', function(err){
    console.log(err);
  });
}

exports = Album;
