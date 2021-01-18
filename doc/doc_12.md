# Vérifier les informations d'indentification d'un utilisateur

# Implémenter la fonction login

Maintenant que nous pouvons créer des utilisateurs dans la base de données, 
il nous faut une méthode permettant de vérifier si un utilisateur qui tente de se connecter dispose d'identifiants valides. 
Implémentons donc notre fonction login :

dans `controllers/user.js`

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
                            token:'TOKEN'
                        });
                    })
                    .catch(error => response.status(500).json({ error}))
                ;
            })
            .catch(error => response.status(500).json({ error}));
    };


Dans cette fonction :

    - nous utilisons notre modèle Mongoose pour vérifier que l'e-mail entré par l'utilisateur correspond à un utilisateur existant de la base de données :

        1) dans le cas contraire, nous renvoyons une erreur 401 Unauthorized ,

        2) si l'e-mail correspond à un utilisateur existant, nous continuons ;

    - nous utilisons la fonction compare debcrypt pour comparer le mot de passe entré par l'utilisateur avec le hash enregistré dans la base de données :

        1) s'ils ne correspondent pas, nous renvoyons une erreur 401 Unauthorized et un message « Mot de passe incorrect ! » ;

        2) s'ils correspondent, les informations d'identification de notre utilisateur sont valides. 
        Dans ce cas, nous renvoyons une réponse 200 contenant l'ID utilisateur et un token. 
        Ce token est une chaîne générique pour l'instant, 
        mais nous allons le modifier et le crypter dans le prochain chapitre.

-------------------------------------------------------------
# Créer des tokens d'autehntification

## Créer des tokens d'authentification

Les tokens d'authentification permettent aux utilisateurs de ne se connecter qu'une seule fois à leur compte.
 Au moment de se connecter, ils recevront leur token et le renverront automatiquement à chaque requête par la suite.
 Ceci permettra au back-end de vérifier que la requête est authentifiée.

Pour pouvoir créer et vérifier les tokens d'authentification, il nous faudra un nouveau package :

    npm install --save jsonwebtoken

Nous l'importerons ensuite dans notre contrôleur utilisateur , et, nous l'utiliserons dans notre fonction login :

dans `conrollers/user.js`

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


Dans le code ci-dessus :

nous utilisons la `fonction sign de jsonwebtoken pour encoder un nouveau token` ;

ce token contient l'ID de l'utilisateur en tant que payload (les données encodées dans le token) ;

nous utilisons une chaîne secrète de développement temporaire RANDOM_SECRET_KEY pour encoder notre token (à remplacer par une chaîne aléatoire beaucoup plus longue pour la production) ;

nous définissons la durée de validité du token à 24 heures. L'utilisateur devra donc se reconnecter au bout de 24 heures ;

nous renvoyons le token au front-end avec notre réponse.

Vous pouvez désormais utiliser l'onglet « Réseau » de Chrome DevTools pour vérifier que, une fois connecté, chaque requête provenant du front-end contient bien un en-tête « Authorization » avec le mot-clé « Bearer » et une longue chaîne encodée. Il s'agit de notre token !

Dans le chapitre suivant, nous créerons un élément de middleware pour vérifier ce token et son contenu afin de nous assurer que seules les requêtes autorisées ont accès aux routes à protéger.