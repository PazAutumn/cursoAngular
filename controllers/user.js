'use strict'

var bcrypt = require('bcrypt-nodejs');
var newUser = require('../models/user');
var jwt = require('../services/jwt');

function pruebas(req, res){
	res.status(200).send({
		message: 'Probando una acción del controlador de usuarios del api rest con node y mongo'
	});
}

function saveUser(req, res){
	var user = new newUser();

	var params = req.body;

	console.log(params);

	user.name = params.name;
	user.surname = params.surname;
	user.email = params.email;
	user.role = 'ROLE_ADMIN';
	user.image = 'null';

	if(params.password){
		//Encriptar contraseña y guardar datos
		bcrypt.hash(params.password, null, null, function(err, hash){
			user.password = hash;
			if(user.name != null && user.surname != null && user.email != null){
				//Guardar usuario
				user.save((err, userStored) => {
					if(err){
						res.status(500).send({message: 'Error al gurdar usuario'});
					}else{
						if(!userStored){
							res.status(404).send({message: 'No se ha registrado el usuario'});
						}else{
							res.status(200).send({user: userStored});
						}
					}
				});
			}else{
				res.status(200).send({message: 'Rellena todos los campos'});
			}
		});
	}else{
		res.status(200).send({message: 'Introduce contraseña'});
	}
}

function loginUser(req, res){
	var params = req.body;

	var email = params.email;
	var password = params.password;

	newUser.findOne({email: email.toLowerCase()}, (err, user) => {
		if(err){
			res.status(500).send({message: 'Error en la petición'});
		}else{
			if(!user){
				res.status(404).send({message: 'El usuario no existe'})
			}else{
				//Comprobar contraseña
				bcrypt.compare(password, user.password, function(err, check){
					if(check){
						//devolver los datos del usuario logeado
						if(params.gethash){
							//Devolver un token de jwt
							res.status(200).send({
								token: jwt.createToken(user)
							});
						}else{
							res.status(200).send({user});
						}
					}else{
						res.status(404).send({message: 'El usuario no ha podido logearse'})
					}
				});
			}
		}
	});
}

module.exports = {
	pruebas,
	saveUser,
	loginUser
};