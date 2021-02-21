# Confifurez le middleware d'authentification

Nous allons créer le middleware qui protégera les routes sélectionnées 
et vérifier que l'utilisateur est authentifié avant d'autoriser l'envoi de ses requêtes.

`Créez un dossier middleware et un fichier auth.js à l'intérieur :`

dans `middleware/auth.js`


    const jwt = require('jsonwebtoken');

    module.exports = (request, response, next) => {
        try {

            /**
            * on récupère le token dans le header authorization
            * et comme dans authorization, on a Bearer (un espace) puis le token
            * on va utiliser split() pour tout récupérer après l'espace
            */
            const token = request.headers.authorization.split(' ')[1];

            /**
            * on decode le token pour le comparer avec la clé secrète
            * qui est pareil que celle qu'on a mis dans la fonction login() en backend
            */
            const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');

            /**
            * losrqu'on décode le token, ça deviens un objet javaScript
            * donc on récupère l'userId qui est dedans
            */
            const userId = decodedToken.userId;

            if(request.body.userId && request.body.userId !== userId)
            {
                throw 'Invalide user ID';
            }
            else{

                /**
                * on met next(), car ce middlewera sera appliquer avant les controleurs de nos routes.
                * donc pour chaque requête avec une route protégé, on va d'abord passé par ce middleware.
                * si lors de la requête , on arrive jusqu'ici, c'est que tous est bon 
                * et on peut passé a un autre middleware du controleur de la route en question
                */
                next();
            }
        }
        catch (error) {
            response.status(401).json({ error: error | 'Requête invalide'});
        }
    }



`module.exports = exporte la fonction qui est dans le fichier middleware/auth.js`

Dans ce middleware :

étant donné que de nombreux problèmes peuvent se produire, nous insérons tout à l'intérieur d'un bloc try...catch ;

nous extrayons le token du header Authorization de la requête entrante. N'oubliez pas qu'il contiendra également le mot-clé Bearer . 
Nous utilisons donc la fonction split pour récupérer tout après l'espace dans le header. 
Les erreurs générées ici s'afficheront dans le bloc catch ;

nous utilisons ensuite la fonction verify pour décoder notre token. 
Si celui-ci n'est pas valide, une erreur sera générée ;

nous extrayons l'ID utilisateur de notre token ;

si la demande contient un ID utilisateur, nous le comparons à celui extrait du token. 
S'ils sont différents, nous générons une erreur ;

dans le cas contraire, tout fonctionne et notre utilisateur est authentifié. 
Nous passons l'exécution à l'aide de la fonction next() .



Maintenant, nous devons appliquer ce middleware à nos routes stuff , qui sont celles à protéger. 
Dans notre routeur stuff , nous importons notre middleware et le passons comme argument aux routes à protéger :

dans `routes/stuff.js`

    const express = require('express');
    const router = express.Router();

    const auth = require('../middleware/auth');

    const stuffCtrl = require('../controllers/stuff');

    router.get('/', auth, stuffCtrl.getAllStuff);
    router.post('/', auth, stuffCtrl.createThing);
    router.get('/:id', auth, stuffCtrl.getOneThing);
    router.put('/:id', auth, stuffCtrl.modifyThing);
    router.delete('/:id', auth, stuffCtrl.deleteThing);

    module.exports = router;


Désormais, à partir du front-end, vous devriez être capable de vous connecter et d'utiliser normalement l'application. 
Pour vérifier que les requêtes non autorisées ne fonctionnent pas, 
vous pouvez utiliser une application (telle que Postman) pour passer une demande sans en-tête Authorization . 
L'API refusera l'accès et renverra une réponse 401.


## En résumé


Dans cette partie du cours :

vous avez ajouté un modèle de données User afin de stocker les informations utilisateur dans votre base de données ;

vous avez implémenté le cryptage de mot de passe sécurisé afin de stocker en toute sécurité les mots de passe utilisateur ;

vous avez créé et envoyé des tokens au front-end pour authentifier les requêtes ;

vous avez ajouté le middleware d'authentification pour sécuriser les routes dans votre API. 
De cette façon, seules les requêtes authentifiées seront gérées.


Dans la dernière partie de ce cours, vous en apprendrez plus sur la gestion des fichiers :

comment capturer les fichiers provenant du front-end ;

comment les enregistrer sur votre serveur, et

comment les supprimer lorsqu'ils ne sont plus nécessaires.