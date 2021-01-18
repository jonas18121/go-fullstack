# Créer des utilisateurs

## Configurer les routes d'authentification

Commençons par créer l'infrastructure nécessaire à nos routes d'authentification.
Il nous faudra un controleur et un routeur, puis nous devrons enregistrer ce routeur dans notre application Express, 
donc dans app.js

D'abord, on crée un fichier `user.js dans notre dossier controllers `

dans `controllers/user.js`

    exports.signup = (request, response, next) => {

    };

    exports.login = (request, response, next) => {

    };

Nous implémenterons ces fonctions bientôt. Pour l'instant, terminons la création des routes.

dans `routes/user.js`

    const express = require('express');
    const router = express.Router();

    const userController = require('../controllers/user');

    router.post('/signup', userController.signup);
    router.post('/login', userController.login);

    module.exports = router; 


Les routes fournies sont celles prévues par l'application front-end.
N'oubliez pas que le segment de route indiqué ici est uniquement le segment final, 
car le reste de l'adresse de la route sera déclaré dans notre application Express.

Maintenant, enregistrons notre routeur dans notre application `app.js` . Pour ce faire, importez le routeur 

    const userRoutes = require('./routes/user');

Puis enregistrez-le :

    app.use('/api/stuff', stuffRoutes);
    app.use('/api/auth', userRoutes);


dans `app.js`

    const express = require('express');
    const bodyParser = require('body-parser');

    /** pour MongoDB */
    const mongoose = require('mongoose');

    /** on charge le fichier de notre router stuff.js */
    const stuffRoutes = require('./routes/stuff')

    /** on charge le fichier de notre router user.js */
    const userRoutes = require('./routes/user')

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

    /** notre router userRoutes réagira a toutes les demandes effectuées vers '/api/user' */
    app.use('/api/user', userRoutes);



    module.exports = app;



Nos routes sont maintenant prêtes. Il est temps de commencer l'implémentation de la logique métier dans le controleur user.


## Créer des utilisateurs

On va installer la package de chiffrement `bcrypt` pour notre fonction `signup` . 

    npm install --save bcrypt


Nous pouvons l'importer dans notre contrôleur et implémenter notre fonction signup (n'oubliez pas d'importer votre modèle User et le bcrypt !) :

dans controllers/user.js

    const bcrypt = require('bcrypt');

    const User = require('../models/user');

    /**
    * inscription user
    * 
    * bcrypt.hash(request.body.password, 10), hash le mot de passe en 10 tours,
    * puis cree un nouveau user avec le mail du corp de la request et password hashé
    * puis user.save() sauvegarde dans la bdd
    */
    exports.signup = (request, response, next) => {

        bcrypt.hash(request.body.password, 10)
            .then(hash => {
                const user = new User({

                    email: request.body.email,
                    password: hash
                });

                user.save()
                    .then(() => response.status(201).json({ message: 'Utilisateur crée !'}))
                    .catch(error => response.status(400).json({ error}));
                ;
            })
            .catch(error => response.status(500).json({ error}));
    };

    exports.login = (request, response, next) => {
        
    };


Dans cette fonction :

nous appelons la fonction de hachage de bcrypt dans notre mot de passe et lui demandons de « saler » le mot de passe 10 fois. 
Plus la valeur est élevée, plus l'exécution de la fonction sera longue, et plus le hachage sera sécurisé. 
Pour plus d'informations, consultez la documentation de bcrypt https://www.npmjs.com/package/bcrypt;

il s'agit d'une fonction asynchrone qui renvoie une Promise dans laquelle nous recevons le hash généré ;

dans notre bloc then , nous créons un utilisateur et l'enregistrons dans la base de données, 
en renvoyant une réponse de réussite en cas de succès, et des erreurs avec le code d'erreur en cas d'échec ;