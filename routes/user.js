'use strict'

var express = require('express');
var userController = require('../controllers/user');

var api = express.Router();
var md_auth = require('../middlewares/authenticated');

api.get('/probando-controlador', md_auth.ensureAuth, userController.pruebas);
api.post('/register', userController.saveUser);
api.post('/login', userController.loginUser);
api.put('/update-user/:id', md_auth.ensureAuth, userController.updateUser);

module.exports = api;