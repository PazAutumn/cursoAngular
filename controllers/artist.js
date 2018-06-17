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

function deleteArtist(req, res){
	var artistId = req.params.id;

	newArtist.findByIdAndRemove(artistId, (err, artistRemoved) => {
		if(err){
			res.status(500).send({message: 'Error al eliminar el artista'});
		}else {
			if(!artistRemoved){
				res.status(404).send({message: 'El artista no ha sido eliminado'});
			}else{
				album.find({artist: artistRemoved._id}).remove((err, albumRemoved) => {
					if(err){
						res.status(500).send({message: 'Error al eliminar el album'});
					}else {
						if(!albumRemoved){
							res.status(404).send({message: 'El album no ha sido eliminado'});
						}else{
							song.find({album: albumRemoved._id}).remove((err, songRemoved) => {
								if(err){
									res.status(500).send({message: 'Error al eliminar la canción'});
								}else {
									if(!songRemoved){
										res.status(404).send({message: 'La canción no ha sido eliminada'});
									}else{
										res.status(200).send({artist: artistRemoved});
									}
								}
							});
						}
					}
				});
			}
		}
	});
}

function uploadImage(req, res){
	var artistId = req.params.id;
	var fileName = 'No subido';

	if(req.files){
		var filePath = req.files.image.path;
		var fileSplit = filePath.split('\\');
		var fileName = fileSplit[2];
		var extSplit = fileName.split('\.');
		var fileExt = extSplit[1];
		
		if(fileExt == 'png' || fileExt == 'jpg' || fileExt == 'gif'){

			newArtist.findByIdAndUpdate(artistId, {image: fileName}, (err, artistUpdated) => {
				if(!artistId){
					res.status(404).send({message: 'No se ha podido actualizar el usuario'});
				}else{
					res.status(200).send({artist: artistUpdated});
				}
			});
		}else{
			res.status(200).send({message: 'Extensión del archivo no válida'});
		}
	}else{
		res.status(200).send({message: 'No has cargado ninguna imagen'});
	}
}

function getImageFile(req, res){
	var imageFile = req.params.imageFile;
	var pathFile = './uploads/artists/' + imageFile;
	fs.exists(pathFile, function(exsists){
		if(exsists){
			res.sendFile(path.resolve(pathFile));
		}else{
			res.status(200).send({message: 'No existe la imagen'});
		}
	});
}



module.exports = {
	getArtist,
	saveArtist,
	getArtists,
	updateArtist,
	deleteArtist,
	uploadImage,
	getImageFile
}