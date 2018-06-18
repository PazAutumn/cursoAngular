'use strict'

var express = require('express');
var albumController = require('../controllers/album');
var api = express.Router();
var md_auth = require('../middlewares/authenticated');

var multipart = require('connect-multiparty');
var md_upload = multipart({uploadDir: './uploads/album'});

api.get('/album', md_auth.ensureAuth, albumController.getAlbum);


module.exports = api;