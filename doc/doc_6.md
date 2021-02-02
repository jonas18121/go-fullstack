# Configurer notre Base de données

url OCR : https://openclassrooms.com/fr/courses/6390246-passez-au-full-stack-avec-node-js-express-et-mongodb/6466348-configurez-votre-base-de-donnees

`On va rendre notre application entièrement dynamique car on va intégré la couche de base de données de notre serveur : MongoDB`

Bien qu'il soit possible de télécharger et d'exécuter MongoDB sur notre propre machine 
( site Web de MongoDB ( https://www.mongodb.com/try?initial=true#community ) pour en savoir plus), 
`pour ce cours nous utiliserons la couche gratuite de MongoDB Atlas`, la « database as a service » (base de données en tant que service).

## Configurez MongoDB Atlas

On accède au site Web de MongoDB  : `https://www.mongodb.com/cloud/atlas` , on s'inscrit pour avoir un compte gratuit.
l'ors de la creation du compte, `on créera un cluster`, on le configure avec `l'option AWS et uniquement les options gratuit` afin de pouvoir développer gratuitement

Pendant le démarrage de votre cluster, vous pouvez accéder à l'`onglet Database Access`. 
D'abord, vous devrez ajouter un utilisateur disposant de la capacité de lecture et d'écriture dans n'importe quelle base de données `Read an write to any database` . 
Choisissez le nom d'utilisateur ainsi que le mot de passe de votre choix et notez-les, car vous en aurez besoin pour connecter votre API à votre cluster.

Vous devrez également accéder à l'`onglet Network Access`, 
cliquer sur Add IP Adress et autoriser l'accès depuis n'importe où (`Add access from Anywhere`).

## Connecion de notre API à notre cluster MongoDB

site : https://mongoosejs.com/

mongodb+srv://go-fullstack:<password>@cluster0.zbjqg.mongodb.net/<dbname>?retryWrites=true&w=majority

Depuis MongoDB Atlas, cliquez sur le bouton Connect et choisissez Connect your application. 
Sélectionnez bien la version la plus récente du driver Node.js, 
puis Connection String Only, et faites une copie de la chaîne de caractères retournée.

De retour sur votre projet, installez le package Mongoose en exécutant, à partir du dossier backend , la commande suivante :

`    npm install --save mongoose`


Mongoose est un package qui facilite les interactions avec notre base de données MongoDB grâce à des fonctions extrêmement utiles.

Une fois l'installation terminée, importez mongoose dans votre fichier app.js en ajoutant la constante suivante :

`    const mongoose = require('mongoose');`

Juste en dessous de votre déclaration de constante app, ajoutez la ligne suivante. 
Veillez à remplacer l'adresse SRV par la vôtre et la chaîne <PASSWORD> par votre mot de passe utilisateur MongoDB :

    mongoose.connect('mongodb+srv://jimbob:<PASSWORD>@cluster0-pme76.mongodb.net/test?retryWrites=true&w=majority',
    { useNewUrlParser: true,
        useUnifiedTopology: true })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));


Après enregistrement voire redémarrage de votre serveur Node si nécessaire, 
vous devriez voir le message « Connexion à MongoDB Atlas réussie ! » dans la console. 
Votre API est à présent connectée à votre base de données et nous pouvons commencer à créer des routes serveur afin d'en bénéficier.

dans `app.js`


    const express = require('express');
    const bodyParser = require('body-parser');

    /** pour MongoDB */
    const mongoose = require('mongoose');

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


# Creer un schema de données

L'un des avantages que nous avons à utiliser Mongoose pour gérer notre base de données MongoDB est que nous pouvons implémenter des schémas de données stricts, 
qui permettent de rendre notre application plus robuste. 
Commençons par créer un schéma Thing (« chose ») pour tout objet mis en vente dans notre application.

## Créer un schéma Thing

Dans le dossier back-end , on crée un dossier appelé `models` et dans ce dossier , on crée un fichier appelé thing.js

dans `thing.js`

    const mongoose = require('mongoose');

    /**
    * on cée notre schema de données
    * le id sera automatiquement généré par MongoDB
    */
    const thingSchema = mongoose.Schema(
        {
            title:          { type: String, required: true },
            description:    { type: String, required: true },
            imageUrl:       { type: String, required: true },
            userId:         { type: String, required: true },
            price:          { type: Number, required: true },
        }
    );

    /**
    * mongoose.model('le_nom_du_model', le_schema_creer)
    * cette fonction model est importante car c'est grace à elle,
    * qu'on pourra utilisée le shema en base de données
    */
    module.exports = mongoose.model('Thing', thingSchema);



Ici, voici ce que nous faisons :

    - nous créons un schéma de données qui contient les champs souhaités pour chaque Thing, 
    indique leur type ainsi que leur caractère (obligatoire ou non). 
    Pour cela, on utilise la méthode Schema mise à disposition par Mongoose. 
    Pas besoin de mettre un champ pour l'Id puisqu'il est automatiquement généré par Mongoose,

    - ensuite, nous exportons ce schéma en tant que modèle Mongoose appelé « Thing », 
    le rendant par là même disponible pour notre application Express.

Ce modèle nous permettra non seulement d'appliquer notre structure de données, 
mais aussi de simplifier les opérations de lecture et d'écriture dans la base de données.
