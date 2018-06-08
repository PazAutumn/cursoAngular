'use strict'

var path = require('path');
var fs = require('fs');

var newArtist = require('../models/artist');
var album = require('../models/album');
var song = require('../models/song');

function getArtist(req, res){
	var artistId = req.params.id;

	newArtist.findById(artistId, (err, artist) => {
		if(err){
			res.status(500).send({message: 'Error en la petición'});
		}else {
			if(!artist){
				res.status(404).send({message: 'El artista no existe'});
			}else{
				res.status(200).send({artist});
			}
		}
	});

	
}

function saveArtist(req, res){
	var artist = new newArtist();

	var params = req.body;
	artist.name = params.name;
	artist.description = params.description;
	artist.image = 'null';

	artist.save((err, artistStored) => {
		if(err){
			res.status(500).send({message: 'Error al guardar el artista'});
		}else{
			if(!artistStored){
				res.status(404).send({message: 'No se ha registrado el artista'});
			}else{
				res.status(200).send({artist: artistStored});
			}
		}
	});
}

module.exports = {
	getArtist,
	saveArtist
};