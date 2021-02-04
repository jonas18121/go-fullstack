# Créer une application Express

site : https://expressjs.com/

Coder des serveurs Web en Node pur est possible, mais long et laborieux. 
En effet, cela exige d'analyser manuellement chaque demande entrante. 
L'utilisation du framework Express simplifie ces tâches, en nous permettant de déployer nos API beaucoup plus rapidement. 

## Installer Express

Pour ajouter Express à notre projet, on va exécuter la commande suivante a partir du dossier back-end
    npm install --save express

`npm install --save express` pour l'enregistrer dans le `package-lock.json`

Maintenant on va créer un nouveau fichier nommé `app.js` qui contiendra notre application, 

dans app.js

    const express = require('express');

    const app = express();

    module.exports = app;

`const express = require('express');` , on va importer `express` dans une constante nommé express

`const app = express();` la constante app contiendra notre application express , grace à express()

`module.exports = app;`, on va exporter la constante app, afin d'utiliser notre application partout dans notre projet go-fullstack

## Exécuter l'application Express sur le serveur Node

Modification dans server.js

    const http = require('http');
    const app = require('./app');

    app.set('port', process.env.PORT || 3000);

    const server = http.createServer(app);

    server.listen(process.env.PORT || 3000);


`const app = require('./app');` On import le fichier app.js dans server.js

`app.set('port', process.env.PORT || 3000);` on dit à l'application express sur quel port et doit tourner, 
on lui passera les mêmes information que `server.listen(process.env.PORT || 3000);`

`const server = http.createServer(app);` on met notre application `app` dans le `http.createServer(app);`
qui va recevoir les requêtes et reponse venant du framework express


Effectuer une demande vers ce serveur générera une erreur 404, car notre application n'a encore aucun moyen de répondre. 
Configurons une réponse simple pour nous assurer que tout fonctionne correctement, 
en effectuant un ajout à notre fichier app.js :

dans app.js

    const express = require('express');

    const app = express();

    app.use((request, response) => {
        response.json({message: 'Votre requête a bien été reçue !'});
    });

    module.exports = app;

`app.use((request, response) => { response.json({message: 'Votre requête a bien été reçue !' }); });` 
app.use tel qu'il est écrit actuellement sera utiliser par express pour renvoyer une réponse.

Si on essaye d'effectuer une requête à notre serveur, nous devrons récupérer un Objet JSON contenant le message que nous avont spécifié.

## Ajouter des middleware

`Une application Express est une série de plusieurs fonctions appelée middleware. série de plusieurs fonctions = middleware` .

Chaque élément de middleware reçois les objets `request et response`,
On peut les lire , les analyser et les manipuler. 
`Le middleware Express reçois également la méthode next` qui permet à chaque middleware de passer a l'autre middleware qui est après.

Si on ne met pas la méthode next(), à la fin d'un élément précis du middleware, 
le script restera bloqué sur cet élément en question et n'ira pas dans les autres éléments du middleware , s'il y en a.

dans app.js
    const express = require('express');

    const app = express();

    /*
    Les 4 méthodes app.use() rassemblé dans ce script forme un middleware
    Donc pour passé d'un app.use() à l'autre, il faut la méthode next(), obligatoirement
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

`Cette application Express contient quatre éléments de middleware :`

    - le premier enregistre « Requête reçue ! » dans la console et passe l'exécution ;

    - le deuxième ajoute un code d'état 201 à la réponse et passe l'exécution ;

    - le troisième envoie la réponse JSON et passe l'exécution ;

    - le dernier élément de middleware enregistre « Réponse envoyée avec succès ! » dans la console.

Il s'agit d'un serveur très simple et qui ne fait pas grand-chose pour l'instant, mais il illustre comment le middleware fonctionne dans une application Express.



## Améliorez server.js

On va apporter quelques amélioration a notre fichier server.js, pour le rendre plus stable et approprier pour le déploiment

dans server.js

    const http = require('http');
    const app = require('./app');

    // app.set('port', process.env.PORT || 3000);


    const normalizePort = val => {
        const port = parseInt(val, 10);

        if (isNaN(port)) {
            return val;
        }
        if (port >= 0) {
            return port;
        }
        return false;
    };

    /* 
        la fonction normalizePort renvoie un port valide, 
        qu'il soit fourni sous la forme d'un numéro ou d'une chaîne ;
    */
    const port = normalizePort(process.env.PORT || '3000');
    app.set('port', port);

    /* 
        la fonction errorHandler recherche les différentes erreurs et les gère de manière appropriée. 
        Elle est ensuite enregistrée dans le serveur ;
    */
    const errorHandler = error => {

        if (error.syscall !== 'listen') {
            throw error;
        }

        const address = server.address();
        const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;

        switch (error.code) {
            case 'EACCES':
                console.error(bind + ' requires elevated privileges.');
                process.exit(1);
                break;
            case 'EADDRINUSE':
                console.error(bind + ' is already in use.');
                process.exit(1);
                break;
            default:
            throw error;
        }

    };

    const server = http.createServer(app);

    /* 
        un écouteur d'évènements est également enregistré, 
        consignant le port ou le canal nommé sur lequel le serveur s'exécute dans la console.
    */
    server.on('error', errorHandler);
    server.on('listening', () => {
        const address = server.address();
        const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
        console.log('Listening on ' + bind);
    });

    server.listen(port);



    

Aperçu rapide de ce qui se passe ici :

    - la fonction normalizePort renvoie un port valide, qu'il soit fourni sous la forme d'un numéro ou d'une chaîne ;

    - la fonction errorHandler  recherche les différentes erreurs et les gère de manière appropriée. Elle est ensuite enregistrée dans le serveur ;

    - un écouteur d'évènements est également enregistré, consignant le port ou le canal nommé sur lequel le serveur s'exécute dans la console.