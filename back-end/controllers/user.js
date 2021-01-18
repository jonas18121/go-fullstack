// représente notre controleur pour ce type de routes `/api/user`

const bcrypt = require('bcrypt');

const User = require('../models/user');

const jwt = require('jsonwebtoken');

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
        .catch(error => response.status(500).json({ error}))
    ;
};

exports.login = (request, response, next) => {
    
    User.findOne({ email: request.body.email })
        .then(user =>{

            // si aucun user est trouvé dans la bdd, avec le mail provenant du formulaire, on lance une erreur 401
            if(!user){
                return response.status(401).json({ error: 'Utilisateur non trouvé ! '});
            }

            //si le mail est bon, on compare le password hashé provenant du formulaire avec celui de la bdd
            bcrypt.compare(request.body.password, user.password)
                .then(valid => {
                    if(!valid){
                        return response(401).json({ error: 'mot de passe incorrect' });
                    }
                    response.status(200).json({ 
                        userId: user._id,
                        token: jwt.sign(
                            { userId: user._id },
                            'RANDOM_TOKEN_SECRET',
                            { expiresIn: '24h' }
                        )
                    });
                })
                .catch(error => response.status(500).json({ error}))
            ;
        })
        .catch(error => response.status(500).json({ error}))
    ;
};