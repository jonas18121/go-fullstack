# Développer la fonction delete du back-end

## Modifier la route DELETE

En ce qui concerne la gestion des fichiers dans notre back-end, 
il faut absolument nous assurer que, 
à chaque suppression d'un `Thing` de la base de données, le fichier image correspondant est également supprimé.

Dans notre contrôleur `stuff` , il nous faut une nouvelle importation. Il s'agit du package `fs` de Node 

puis, nous pouvons modifier notre fonction deleteThing() :

dans `controllers/stuff`

    const fs = require('fs');

    exports.deleteThing = (request, response, next) => {

        Thing.findOne({ _id: request.params.id })
            .then(thing => {

                const filename = thing.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filemane}`, () => {

                    Thing.deleteOne({ _id: request.params.id })
                        .then(() => response.status(200).json({ message: 'Objet supprimé !'}))
                        .catch(error => response.status(404).json({ error }))
                    ;
                })
            })
            .catch()
        ;
    }


`fs signifie « file system » (soit « système de fichiers » en français).` 
Il nous donne accès aux fonctions qui nous permettent de modifier le système de fichiers, 
y compris aux fonctions permettant de supprimer les fichiers.


Dans cette fonction :

- nous utilisons l'ID que nous recevons comme paramètre pour accéder au `Thing` correspondant dans la base de données ;

- nous utilisons le fait de savoir que notre URL d'image contient un segment `/images/` pour séparer le nom de fichier ;

- nous utilisons ensuite la `fonction unlink du package fs pour supprimer ce fichier`, en lui passant le fichier à supprimer et le callback à exécuter une fois ce fichier supprimé ;

- dans le callback, nous implémentons la logique d'origine, `en supprimant le Thing de la base de données`.


Notre API peut désormais gérer correctement toutes les opérations CRUD contenant des fichiers : 
lorsqu'un utilisateur crée un Thing , met à jour un Thing existant ou supprime un Thing !



## Récapitulons

Vous avez presque terminé. Bravo !

Regardons ce que vous avez appris :

vous avez créé un serveur Node et l'avez utilisé pour servir une application Express ;

vous avez connecté votre application à une base de données MongoDB et, à l'aide de Mongoose, vous avez créé une API RESTful permettant les opérations CRUD (Create, Read, Update and Delete — Créer, Lire, Modifier et Supprimer)

vous avez implémenté une authentification sécurisée à base du token JWT ;

enfin, vous avez implémenté la gestion du téléchargement de fichiers, permettant ainsi aux utilisateurs d'ajouter et de supprimer des images.