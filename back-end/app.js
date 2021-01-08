const express = require('express');

const app = express();

/*
Les 4 méthodes app.use() rassemblé dans ce script forme un middleware
Donc pour passé d'un app.use() à l'autre, il faut la méthode next()
*/

app.use((request, response, next) => {
    console.log('Requête reçue !');
    next();
});

app.use((request, response, next) => {
    response.status(201);
    next();
});

app.use((request, response, next) => {
    response.json({message: 'Votre requête a bien été reçue !'});
    next();
});

app.use((request, response) => {
    console.log('Réponse envoyer avec succès !');
});

module.exports = app;