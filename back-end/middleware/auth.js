const jwt = require('jsonwebtoken');

module.exports = (request, response, next) => {
    try {

        /**
         * on récupère le token dans le header authorization
         * et comme dans authorization, on a Bearer (un espace) puis le token
         * on va utiliser split(' ') pour tout récupérer après l'espace
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