# Créer une route POST

## Recever des articles de l'application front-end

Bien que nous puissions pas , pour le monement , stocker nos données en base de données, comme on ne l'a pas encore configurer.
on va pouvoir veiller à recevoir correctement les données du front-end vers le back-end.

L'application front-end contient un formulaire « Vendre un article », 
qui envoie une demande POST (contenant l'article à vendre) à notre route api/stuff 

Voyons comment nous pouvons capturer ces données.

Pour gérer le demande POST provenant de l'application front-end, 
`on doit être capables d'extraire l'objet JSON de la demande`. 
Il nous faudra le package `body-parser`. 
On l'installe en tant que dépendance de production à l'aide de `npm`

`    npm install --save body-parser`

on l'import dans notre fichier app.js

`   const bodyParser = require('body-parser');`

On définit sa fonction json comme middleware global dans notre application, 
juste après avoir défini les headers de la réponse.

`   app.use(bodyParser.json())`

Maintenant, `body-parser` va analysé le corps de la demande. Au lieu de l'écrire dans un middleware `.use()` qui traiterait toutes toutes les requêts,
on va l'écrire dans un middelware `.post` qui ne traitera que les requêtes de type POST

    app.post('/api/stuff', (request, response, next) => {
        console.log(request.body);
        response.status(201).json({
            message: 'Objet créé !'
        });
    });

Veillez à placer la route POST au-dessus du middleware pour les demandes GET, 
car la logique GET interceptera actuellement toutes les demandes envoyées à votre point de terminaison /api/stuff , 
étant donné qu'on ne lui a pas spécifié de verbe spécifique. 
Placer la route POST au-dessus interceptera les demandes POST, 
en les empêchant d'atteindre le middleware GET.

Désormais, si on remplit le formulaire dans l'application front-end et qu'on l'envoye, 
l'objet qu'on viens de créer doit s'enregistrer dans notre console Node !


dans `App.js`

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
    *
    * Le dernier middleware d'une chaîne doit renvoyer la réponse au client pour empêcher la requête d'expirer.
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

## En résumé

Dans cette permière partie du cours on a :

    - Configuré notre environnement de développement , avec toutes les dépendances requises pour démarrer
    - Démarré notre premier serveur Node et on l'a utiliser pour gérer notre première application express
    - Créé 2 routes pour notre application et on a implémenté CORS pour s'assurer que le front-end pouvait effectuer des appels vers notre application en toutes sécurité
