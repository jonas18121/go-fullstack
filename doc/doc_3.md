# Créer une application Express

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