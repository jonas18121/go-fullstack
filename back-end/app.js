const express = require('express');
const bodyParser = require('body-parser');

/** pour MongoDB */
const mongoose = require('mongoose');

/** on charge le fichier de notre router stuff.js */
const stuffRoutes = require('./routes/stuff');

/** on charge le fichier de notre router user.js */
const userRoutes = require('./routes/user');

/** accéder au path de notre serveur */
const path = require('path');


/** framework express */
const app = express();

const uri = "mongodb+srv://go-fullstack:go-fullstack@cluster0.zbjqg.mongodb.net/go-fullstack?retryWrites=true&w=majority";

/**
 * connexion à MongoDB
 */
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'))
;


/**
 * Dans ce middleware, on ne met pas de route en premier argument, 
 * afin que tous les autres middleware puisse en bénéficier de ce header
 * et on aura plus d'erreurs de CORS
 */
app.use((request, response, next) => {
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    response.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

/**
 * bodyParser.json() va transformer le corp de la requête en Json ( en objet javasript utilisable )
 * en utilisant app.use() au lieu de (app.post(), app.get(), app.put() ect...) 
 * ça va agir sur toutes les routes de l'application 
 */
app.use(bodyParser.json());

/**
 * indique à Express qu'il faut gérer la ressource images de manière statique
 *  (un sous-répertoire de notre répertoire de base, __dirname ) 
 * à chaque fois qu'elle reçoit une requête vers la route /images
 */
app.use('/images', express.static(path.join(__dirname, 'images')));

/** notre router stuffRoutes réagira a toutes les demandes effectuées vers '/api/stuff' */
app.use('/api/stuff', stuffRoutes);

/** notre router userRoutes réagira a toutes les demandes effectuées vers '/api/user' */
app.use('/api/auth', userRoutes);



module.exports = app;