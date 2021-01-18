// représente notre controleur pour ce type de routes `/api/user`

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