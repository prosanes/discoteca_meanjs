'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  mongoosastic = require('mongoosastic'),
  Schema = mongoose.Schema;

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
    es_indexed: true
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
});

AlbumSchema.plugin(mongoosastic);

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
