'use strict'

var path = require('path');
var fs = require('fs');
var mongoosePaginate = require('mongoose-pagination')
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

function getArtists(req, res){
	if(req.params.page){
		var page = req.params.page;
	}else{
		var page = 1;
	}
	
	var itemsPerPage = 3;

	newArtist.find().sort('name').paginate(page, itemsPerPage, function(err, artist, total){
		if(err){
			res.status(500).send({message: 'Error en la petición'});
		}else{
			if(!artist){
				res.status(404).send({message: 'No hay artistas'});
			}else{
				return res.status(200).send({
					totalItems: total,
					artist: artist
				});
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


function updateArtist(req, res){
	var artistId = req.params.id;
	var update = req.body;

	newArtist.findByIdAndUpdate(artistId, update, (err, artistUpdated) => {
		if(err){
			res.status(500).send({message: 'Error al guardar el artista'});
		}else {
			if(!artistUpdated){
				res.status(404).send({message: 'El artista no ha sido actualizado'});
			}else{
				res.status(200).send({artistUpdated});
			}
		}
	});
}

module.exports = {
	getArtist,
	saveArtist,
	getArtists,
	updateArtist
};