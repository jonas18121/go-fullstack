# Enregistrer et récupérer des données

En utilisant le modèle `Thing (models/thing.js)` , on va exploiter Mongoose.
L'enregistrement et la rucupération de données dans la base de données est un jeu d'enfant ! 

## Enregistrement des Things dans la base de données

Pour pouvoir utiliser notre nouveau modèle Mongoose dans l'application, 
nous devons l'impotrer dans le fichier `app.js` : const Thing = require('./models/thing');

puis on remplace la logique dans notre route post

    app.post('/api/stuff', (req, res, next) => {
        delete req.body._id;
        const thing = new Thing({
            ...req.body
        });
        thing.save()
            .then(() => res.status(201).json({ message: 'Objet enregistré !'}))
            .catch(error => res.status(400).json({ error }));
    });

dans app.post(), on crée une instance du modèle `Thing` en lui passant un objet Javascript 
contenant toutes les informations requises du corps de requête analysé (`en ayant supprimé en amont le faux _id envoyé par le front-end`).

`L'opérateur spread ... est utilisé pour faire une copie de tous les éléments de req.body .` 
Pour plus d'informations sur l'opérateur spread, rendez-vous sur la documentation de MDN.
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax

`Ce modèle comporte une méthode save() qui enregistre simplement votre Thing dans la base de données.`

`La méthode save() renvoie une Promise. `
Ainsi, `dans notre bloc then()` , nous renverrons une réponse de réussite avec un `code 201 de réussite`. 
`Dans notre bloc catch()` , nous renverrons une réponse avec l'erreur générée par Mongoose ainsi qu'un `code d'erreur 400`.

dans `app.js`

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
    mongoose.connect(uri,
    { useNewUrlParser: true,
        useUnifiedTopology: true 
    })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));


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


## Récupération de la liste de Thing en vente

A présent, on va implémenter notre route GET afin qu'elle renvois tous les `Thing` dans la base de données

    app.use('/api/stuff', (request, response, next) => {
    
        Thing.find()
            .then(things => response.status(200).json(things))
            .catch(error => response.status(400).json({ error }));
    });


ici, on utilise la methode `find()` dans notre modèle Mongoose afin de renvoyer un tableau contenant tous les Things dans notre base de données.
Maintenant, si on ajoute un autre Thing, il doit s'affiché immédiatement sur notre page d'article en vente.

En revanche, si on clique sur l'un des Things , l'affichage d'un seul élément ne fonctionne pas. 
En effet, il tente d'effectuer un appel GET différent pour trouver un Thing individuel. 

## Récupération d'un spécifique

On va ajouter une route juste après le POST et `qui va nous permettre d'afficher un Thing précis via son id`

    app.get('/api/stuff/:id', (req, res, next) => {
        Thing.findOne({ _id: req.params.id })
            .then(thing => res.status(200).json(thing))
            .catch(error => res.status(404).json({ error }));
    });

traduction de : `Thing.findOne({ _id: req.params.id })`

`{ _id: req.params.id }` = objet de comparaison , pour savoir quel objet on affiche via la fonction findOne(), l'id a été passé dans l'URL

Dans cette route :
.
    - on utilise la méthode `get()` pour répondre uniquement aux demandes GET à cet endpoint
    - on utilise `deux-points : ` en face du segment dynamique de la route pour la rendre accessible en tant que paramètre
    - on utilise la méthode `findOne()` dans notre modèle `Thing` pour trouver le `Thing` unique ayant le même _id que le paramètre de la requête
    - Ce `Thing` est ensuite retourné dans une Promise et envoyer au front-end
    - Si aucun `Thing` n'est trouvé ou si une erreur se produit, on envoie une errer 404 au front-end, avec l'erreur générée.


dans `app.js avec beaucoup de commentaire`

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

        console.log(response);
        Thing.findOne({ _id: request.params.id })
            .then(thing => response.status(200).json(thing))
            .catch(error => response.status(404).json({error}))
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

        Thing.find()
            .then(things => response.status(200).json(things))
            .catch(error => response.status(400).json({ error }))
        ;
    });


    module.exports = app;



dans `app.js sans trop de commentaire`

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
    */
    app.post('/api/stuff', (request, response, next) => {

        delete request.body._id;

        const thing = new Thing({
            ...request.body
        });

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

        Thing.findOne({ _id: request.params.id })
            .then(thing => response.status(200).json(thing))
            .catch(error => response.status(404).json({error}))
        ;

    });


    /* 
    *   afficher tous les objet en ventes
    */
    app.get('/api/stuff', (request, response, next) => {

        Thing.find()
            .then(things => response.status(200).json(things))
            .catch(error => response.status(400).json({ error }))
        ;
    });


    module.exports = app;