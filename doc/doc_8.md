# Modifier et supprimer des données

## Mettez à jour un thing existant

On va ajouter une autre route dans notre application , juste en bas de notre route individuelle. 
Elle répondra aux requ^étes PUT

    app.put('/api/stuff/:id', (req, res, next) => {
        Thing.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
            .then(() => res.status(200).json({ message: 'Objet modifié !'}))
            .catch(error => res.status(400).json({ error }));
    });


traduction de : `Thing.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })`

`{ _id: req.params.id }` = objet de comparaison , pour savoir quel objet on modifie via la fonction updateOne(), l'id a été passé dans l'URL

`...req.body` = spread operator pour récupérer le `Thing qui est dans le corp de la requête

`{ ...req.body, _id: req.params.id }` = on s'assure que l'id du Thing qui est dans le corp de la requète soit la même que le celui qui a été passé dans l'URL


Ci-dessus, nous exploitons la `méthode updateOne()` dans notre modèle Thing . 
Cela nous permet de mettre à jour le Thing qui correspond à l'objet que nous passons comme premier argument. 
Nous utilisons aussi le paramètre id passé dans la demande et le remplaçons par le Thing passé comme second argument.


`L'utilisation du mot-clé new avec un modèle Mongoose crée par défaut un champ_id .`

`Utiliser ce mot-clé générerait une erreur,` car nous tenterions de modifier un champ immuable dans un document de la base de données. Par conséquent, 
nous devons utiliser le paramètre id de la requête pour configurer notre Thing avec le même_id qu'avant.



## Suppression d'un Thing

La dernière route qu'on ajoute est la route DELETE

    app.delete('/api/stuff/:id', (req, res, next) => {
        Thing.deleteOne({ _id: req.params.id })
            .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
            .catch(error => res.status(400).json({ error }));
    });


La méthode deleteOne() de notre modèle fonctionne comme findOne() et updateOne() dans le sens où nous lui passons un objet correspondant au document à supprimer. 
Nous envoyons ensuite une réponse de réussite ou d'échec au front-end.

Félicitations ! Désormais, notre application implémente le CRUD complet :

    - create (création de ressources) ;

    - read (lecture de ressources) ;

    - update (modification de ressources) ;

    - delete (suppression de ressources).

L'application permet donc désormais un parcours client complet !

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

        /** le front-end va renvoyer un id qui ne sera pas le bon , vu que MongoDB va le généré automatiquement
        * on va supprimer l'id du corp de la requète avant de copier l'objet
        */
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
    */
    app.get('/api/stuff', (request, response, next) => {

        Thing.find()
            .then(things => response.status(200).json(things))
            .catch(error => response.status(400).json({ error }))
        ;
    });


    module.exports = app;


## En résumé

Dans cette partie du cours :

on a configuré notre `base de données MongoDB et l'avons connectée à notre application Express ;`

on a utilisé `Mongoose pour créer un modèle de données afin de faciliter les opérations de la base de données ;`

on a implémenté, dans notre application Express, `les routes CRUD qui exploitent votre modèle de données Mongoose,` rendant ainsi votre application entièrement dynamique.