# Optimiser la structure du back-end

Nous allons `réoganiser la structure de notre back-end pour en faciliter la compréhension et la gestion`.
Il est techniquement possible de conserver toute notre logique dans le fichier app.js,
mais fichier peut vite devenir bien trop volumineux, ce qui compliquerait la gestion. 

## Configurer le routage

La première chose qu'on va faire est de `dissocier notre logique de routing et la logique globale de l'application`.
On crée dans le dossier back-end, un dossier ` routes ` puis dans ce nouveau dossier, un fichier `stuff.js`. 
qui contiendra la logique de nos routes `stuff`, 
c'est a dire qui aurons cette routes au début de base `/api/stuff` .
`On met aussi le model dont on a besoin qui est thing`

dans `stuff.js` , `stuff.js` représente notre routeur pour ce type de routes de base `/api/stuff`

    const express = require('express');

    const router = express.router();

    /** model */
    const Thing = require('../models/thing');



    module.exports = router;


explication : 

On crée un `routeur Express`, car jusqu'à présent, nous avions enregistré nos routes directement dans notre application.
`Maintenanton va  enregistrer nos routes dans notre routeur Express, puis enregistrer notre routeur l'application.`

Donc, dans `app.js` on copie/coupe tous les middleware qui on la routes`/api/stuff` et les colle dans notre router `stuff.js`.
puis on remplace nos `app.get(), app.put(), app.post(), app.delete()` par `router.get(), router.put(), router.post(), router.delete()` dans notre router `stuff.js`


`/api/stuff doit être supprimé de chaque segment de route.` 
`Si cela supprime une chaîne de route, on laisse une barre oblique / `

Nous devons désormais enregistrer notre nouveau routeur dans notre fichier app.js . D'abord, nous devons l'importer : `const stuffRoutes = require('./routes/stuff');`

Nous voulons enregistrer notre routeur pour toutes les demandes effectuées vers /api/stuff . 
Par conséquent, on tape : `app.use('/api/stuff', stuffRoutes);`




dans `app.js`

    const express = require('express');
    const bodyParser = require('body-parser');

    /** pour MongoDB */
    const mongoose = require('mongoose');

    /** on charge le fichier de notre router stuff.js */
    const stuffRoutes = require('./routes/stuff')

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

    /** notre router stuffRoutes réagira a toutes les demandes effectuées vers '/api/stuff' */
    app.use('/api/stuff', stuffRoutes);



    module.exports = app;








dans `stuff.js`

    // représente notre routeur pour ce type de routes `/api/stuff`

    const express = require('express');

    // on crée un routeur
    const router = express.Router();

    /** model */
    const Thing = require('../models/thing');


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
    router.post('/', (request, response, next) => {

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
    router.get('/:id', (request, response, next) => {

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
    router.put('/:id', (request, response, next) => {

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
    router.delete('/:id', (request, response, next) => {

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
    router.get('/', (request, response, next) => {
        
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
            imageUrl: 'https://www.publicdomainpictures.net/pictures/10000/velka/1536-1249273362hbHb.jpg',
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


    module.exports = router;


## Configurer les contrôleurs

pour rendre notre structure encore plus modulaire, pour simplifier la lecture et la gestion de notre code,
`on va séparer la logique métier de nos routes en controlleurs`

`On crée un dossier controllers dans notre dossier back-end et on crée un autre fichier stuff.js`. Ce sera notre contrôleur `stuff`. 

`dans routes/stuff.js on importe notre contrôleur : `

    const stuffCtrl = require('../controllers/stuff');

dans `routes/stuff.js` 

    // représente notre routeur pour ce type de routes `/api/stuff`

    const express = require('express');

    // on crée un routeur
    const router = express.Router();

    /** on récupère notre controleur pour ce type de routes `/api/stuff` */
    const stuffController = require('../controllers/stuff');


    /**
    * créer un objet pour la vendre
    * 
    * grace a app.use(bodyParser.json()); qui est dans app.js
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
    router.post('/', stuffController.createThing);


    /**
    * Afficher un objet précis
    * 
    * dans request.params , on a les paramètre qui on été envoyer , ici c'est l'id
    */
    router.get('/:id', stuffController.getOneThing);

    /**
    * Modifier un objet précis
    * 
    * dans request.params , on a les paramètre qui on été envoyer , ici c'est l'id
    */
    router.put('/:id', stuffController.modifyThing);

    /**
    * Supprimer un objet précis
    * 
    * dans request.params , on a les paramètre qui on été envoyer , ici c'est l'id
    */
    router.delete('/:id', stuffController.deleteThing);


    /* 
    *   afficher tous les objet en ventes
    *
    *  Le premier argument est la route ( endpoint ) qui permettra de recevoir le contenu de la constante stuff
    *   l'addresse absolue est pour l'instant : 'http://localhost:3000/api/stuff',
    *   notre partie front-end pourra recupéré le contenu de la constante stuff, a cette adresse absolue
    */
    router.get('/', stuffController.getAllStuff);


    module.exports = router;



dans `controllers/stuff.js`

    // représente notre controleur pour ce type de routes `/api/stuff`

    /** model */
    const Thing = require('../models/thing');


    exports.createThing = (request, response, next) => {

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
    }

    exports.getOneThing = (request, response, next) => {

        //console.log(response);
        Thing.findOne({ _id: request.params.id })
            .then(thing => response.status(200).json(thing))
            .catch(error => response.status(404).json({error}))
        ;
    }


    exports.modifyThing = (request, response, next) => {

        //console.log(response);
        Thing.updateOne({ _id: request.params.id }, { ...request.body, _id: request.params.id})
            .then(() => response.status(200).json({ message: 'Objet modifié !'}))
            .catch(error => response.status(404).json({ error }))
        ;

    }


    exports.deleteThing = (request, response, next) => {

        //console.log(response);
        Thing.deleteOne({ _id: request.params.id })
            .then(() => response.status(200).json({ message: 'Objet supprimé !'}))
            .catch(error => response.status(404).json({ error }))
        ;

    }


    exports.getAllStuff = (request, response, next) => {
        
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
            imageUrl: 'https://www.publicdomainpictures.net/pictures/10000/velka/1536-1249273362hbHb.jpg',
            price: 2900,
            userId: 'qsomihvqios',
            },
        ];

        response.status(200).json(stuff); */

        Thing.find()
            .then(things => response.status(200).json(things))
            .catch(error => response.status(400).json({ error }))
        ;
    }








