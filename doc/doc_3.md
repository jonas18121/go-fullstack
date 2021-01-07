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