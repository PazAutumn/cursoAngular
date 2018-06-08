'use strict'

var express = require('express');
var artistController = require('../controllers/artist');
var api = express.Router();
var md_auth = require('../middlewares/authenticated');

api.get('/artist', md_auth.ensureAuth, artistController.getArtist);
api.post('/artist', md_auth.ensureAuth, artistController.saveArtist);

module.exports = api;