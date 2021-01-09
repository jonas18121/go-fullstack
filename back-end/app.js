const express = require('express');
const bodyParser = require('body-parser');

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

/**
 * va transformer le corp de la requête en Json ( en objet javasript utilisable )
 * en utilisant app.use() au lieu de (app.post(), app.get(), app.put() ect...) 
 * ça va agir sur toutes les routes de l'application 
 */
app.use(bodyParser.json());

/**
 * pour l'instant rien est sauvegarder en base de données
 * grace a app.use(bodyParser.json()); 
 * on aura acces au cors de la requête dans ce middleware en faisant request.body
 * l'application front-end va quand même attendre une réponse.
 * donc il faudra renvoyer une réponse avec un status code et un message json par exemple :
 * response.status(201).json({ message: 'Objet créé !' });
 */
app.post('/api/stuff', (request, response, next) => {
    console.log(request.body);
    response.status(201).json({
        message: 'Objet créé !'
    });
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