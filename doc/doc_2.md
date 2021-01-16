# Démarrer le serveur Node

## Qu'est ce que Node ?

Avant de nous lancer dans l'écriture du code, qu'est-ce que Node ? Qu'est-ce qu'Express ? Y-a-t-il une différence ?

`Node est le Runtime qui permet d'écrire toutes nos tâches coté serveur, en Javascript.
Telles que la logique métier, la persistance des données et la sécurité.

Node ajoute également des fonctionnalités que le JavaScript du navigateur standard ne possède pas, 
comme par exemple l'accès au système de fichiers local.

Express est, pour faire court, un framework reposant sur Node qui facilite la création et la gestion des serveurs Node, 
comme vous le verrez à mesure que nous progresserons dans ce cours.

## Initialiser notre projet

On crée un sous-dossier `back-end ` go-fullstack/back-end/.
dedans on exécute la commande `npm init` pour `initialiser un nouveau projet Node`.
lors de l'initialisation on pourra garder les option par défault ou les modifier si on le souhaite. 
par contre pour le `point d'entrée ( entry point : )` , on va mettre `server.js`.

Ce processus génère un fichier `package.json` vierge, dans lequel seront enregistrés les détails de tous les packages `npm` que nous utiliserons pour ce projet.

À ce stade, vous pouvez initialiser un dépôt Git en exécutant git init depuis votre dossier backend . 
N'oubliez pas de créer un fichier .gitignore contenant la ligne node_modules afin de ne pas envoyer ce dossier (qui deviendra volumineux) vers votre dépôt distant.

Créez un fichier server.js à l'intérieur de votre dossier backend . 
Il contiendra votre premier serveur Node.

## Démarrer un serveur basique

Pour créer un serveur node dans le fichier server.js, il faudra le code suivant :



    const http = require('http');

    const server = http.createServer((request, response) => {
        response.end('Voila la réponse du serveur ! ');
    });

    server.listen(process.env.PORT || 3000);



Ici, on import le package `HTTP` natif de Node et on l'utilise pour créer un serveur,
en passant une fonction qui sera exécutée à chaque appel effectué vers ce serveur.
Cette fonction reçois les objets `request et response` en tant qu'argument.
Dans cette exemple , on utlise la méthode `end` de la réponse pour renvoyer une réponse de type `string` à l'appelant.

à `server.listen(process.env.PORT || 3000);` on configure le serveur pour qu'il écoute.

    - soit la variable d'environnement du port grâce à process.env.PORT : si la plateforme de déploiement propose un port par défaut, c'est celui-ci qu'on écoutera ;

    - soit le port 3000, ce qui nous servira dans le cas de notre plateforme de développement.

On démarre le serveur en exécutant `node server` à partir de la ligne de commande.
et pour vérifier le tout , on peut aller voir ça dans le navigateur en allant à cette adresse : http://localhost:3000

on peut utiliser postman pour effectué les requète en GET ou autre verbe http


## Installer nodemon

pour simplifier le développement Node, on va installer `nodemon` en ligne de commande

    npm install -g nodemon

Maintenant , au lieu d'utiliser `node server` , on va utiliser `nodemon server`, qui va surveillé les modification de nos fichiers et redémarrera automatiquement le serveur lorsqu'il aura besoin d'être mis à jour.
On aura plus besoin de redémarrer le serveur manuellement après chaque modification.