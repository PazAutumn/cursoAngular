'use strict'

var path = require('path');
var fs = require('fs');
var mongoosePaginate = require('mongoose-pagination')
var newArtist = require('../models/artist');
var album = require('../models/album');
var song = require('../models/song');

function getAlbum(req, res){
	res.status(200).send({message: 'Acción getAlbum'});
}


module.exports = {
	getAlbum
}