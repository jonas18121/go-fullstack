const express = require('express');

const app = express();

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

/* 
    Le premier argument est la route ( endpoint ) qui permettra de recevoir le contenu de la constante stuff
    l'addresse absolue est pour l'instant : 'http://localhost:3000/api/stuff',
    notre partie front-end pourra recupéré le contenu de la constante stuff, a cette adresse absolue
*/
app.use('/api/stuff', (request, response, next) => {
    
    const stuff = [
        {
          _id: 'oeihfzeoi',
          title: 'Mon premier objet',
          description: 'Les infos de mon premier objet',
          imageUrl: 'https://cdn.pixabay.com/photo/2019/06/11/18/56/camera-4267692_1280.jpg',
          price: 4900,
          userId: 'qsomihvqios',
        },
        {
          _id: 'oeihfzeomoihi',
          title: 'Mon deuxième objet',
          description: 'Les infos de mon deuxième objet',
          imageUrl: 'https://cdn.pixabay.com/photo/2019/06/11/18/56/camera-4267692_1280.jpg',
          price: 2900,
          userId: 'qsomihvqios',
        },
    ];

    response.status(200).json(stuff);
});


module.exports = app;