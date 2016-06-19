'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Album Schema
 */
var AlbumSchema = new Schema({
  title: {
    type: String,
    default: '',
    required: 'Preencha o titulo do album',
    trim: true
  },
  artist: {
    type: Schema.ObjectId,
    required: 'Escolha um artista',
    ref: 'Artist'
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

mongoose.model('Album', AlbumSchema);
