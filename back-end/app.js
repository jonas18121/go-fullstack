const express = require('express');
const bodyParser = require('body-parser');

/** pour MongoDB */
const mongoose = require('mongoose');

/** model */
const Thing = require('./models/thing');

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
 * créer un objet pour la vendre
 * 
 * pour l'instant rien est sauvegarder en base de données
 * grace a app.use(bodyParser.json()); 
 * on aura acces au cors de la requête dans ce middleware en faisant request.body
 * l'application front-end va quand même attendre une réponse.
 * donc il faudra renvoyer une réponse avec un status code et un message json par exemple :
 * response.status(201).json({ message: 'Objet créé !' });
 * 
 * Le dernier middleware d'une chaîne doit renvoyer la réponse au client pour empêcher la requête d'expirer.
 * 
 * 
 * ------------------------------------------------------------------------------------------
 *  const thing = new Thing({
 *
 *       raccourcie javascript pour récupérer les données dans le corp du body 
 *      ...request.body
 *  });
 * 
 * remplace 
 * 
 * const thing = new Thing({
 *
 *       title: request.body.title,
 *       description: request.body.description,
 *       imageUrl: request.body.imageUrl,
 *       userId: request.body.userId,
 *       price: request.body.price,
 *   });
 * 
 * grace aux 3 petits point, appelé spread (...request.body) : 
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax
 */
app.post('/api/stuff', (request, response, next) => {

    /** le front-end va renvoyer un id qui ne sera pas le bon , vu que MongoDB va le généré automatiquement
     * on va supprimer l'id du corp de la requète avant de copier l'objet
    */
    delete request.body._id;

    const thing = new Thing({

        /** raccourcie javascript pour récupérer les données dans le corp du body */
        ...request.body
    });

    /**
     * .save() enregistre l'objet dans la bdd et re tourne une promise
     * donc faut rajouter .then et .catch
     */
    thing.save()
        .then(() => response.status(201).json({ message: 'Objet enregistré !'}))
        .catch(error => response.status(400).json({ error}))
    ;
});


/**
 * Afficher un objet précis
 * 
 * dans request.params , on a les paramètre qui on été envoyer , ici c'est l'id
 */
app.get('/api/stuff/:id', (request, response, next) => {

    //console.log(response);
    Thing.findOne({ _id: request.params.id })
        .then(thing => response.status(200).json(thing))
        .catch(error => response.status(404).json({error}))
    ;

});

/**
 * Modifier un objet précis
 * 
 * dans request.params , on a les paramètre qui on été envoyer , ici c'est l'id
 */
app.put('/api/stuff/:id', (request, response, next) => {

    //console.log(response);
    Thing.updateOne({ _id: request.params.id }, { ...request.body, _id: request.params.id})
        .then(() => response.status(200).json({ message: 'Objet modifié !'}))
        .catch(error => response.status(404).json({ error }))
    ;

});

/**
 * Supprimer un objet précis
 * 
 * dans request.params , on a les paramètre qui on été envoyer , ici c'est l'id
 */
app.delete('/api/stuff/:id', (request, response, next) => {

    //console.log(response);
    Thing.deleteOne({ _id: request.params.id })
        .then(() => response.status(200).json({ message: 'Objet supprimé !'}))
        .catch(error => response.status(404).json({ error }))
    ;

});


/* 
 *   afficher tous les objet en ventes
 *
 *  Le premier argument est la route ( endpoint ) qui permettra de recevoir le contenu de la constante stuff
 *   l'addresse absolue est pour l'instant : 'http://localhost:3000/api/stuff',
 *   notre partie front-end pourra recupéré le contenu de la constante stuff, a cette adresse absolue
*/
app.get('/api/stuff', (request, response, next) => {
    
    /* const stuff = [
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

    response.status(200).json(stuff); */

    Thing.find()
        .then(things => response.status(200).json(things))
        .catch(error => response.status(400).json({ error }))
    ;
});


module.exports = app;