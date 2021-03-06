'use strict'

var express = require('express');
var bodyParser = require('body-parser');

var app = express();

//cargar rutas
var userRoutes = require('./routes/user');
var artistRoutes = require('./routes/artist');
var albumRoutes = require('./routes/album');


app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//configurar headers http

//rutas base
app.use('/api', userRoutes);
app.use('/api', artistRoutes);
app.use('/api', albumRoutes);

module.exports = app;