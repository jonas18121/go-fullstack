# Preparer la base de données pour les informations d'authentification

## Comprener le stockage de mot de passe sécurisé

Dans les chapitres suivants, nous implémenterons l'`authentification par e-mail et mot de passe pour notre API.` 
Cela implique de `stocker des mots de passe utilisateur dans notre base de données` d'une manière ou d'une autre. 
Ce que `nous ne voulons` certainement `pas` faire est de `les stocker sous la forme de texte brut` : 
quiconque accéderait à notre base de données verrait la liste complète des informations de connexion de tous les utilisateurs. 
`À la place, nous stockerons le mot de passe de chaque utilisateur sous la forme d'un hash ou d'une chaîne chiffrée.`

`Le package de chiffrement que nous utiliserons, bcrypt` ,
utilise un algorithme unidirectionnel pour `chiffrer et créer un hash des mots de passe utilisateur,` 
que nous stockerons ensuite dans le document de la base de données relatif à chaque utilisateur. 

Lorsqu'un utilisateur tentera de se connecter, nous utiliserons bcrypt pour créer un hash avec le mot de passe entré, 
puis le `comparerons au hash stocké dans la base de données`. 
Ces deux hash ne seront pas les mêmes : 
cela poserait un problème de sécurisation, car les pirates informatiques n'auraient qu'à deviner les mots de passe jusqu'à ce que les hash correspondent. 

`Le package bcrypt permet d'indiquer si les deux hash ont été générés à l'aide d'un même mot de passe initial.` 
Il nous aidera donc à implémenter correctement le stockage et la vérification sécurisés des mots de passe.

La première étape de l'implémentation de l'authentification est de créer un modèle de base de données pour les informations de nos utilisateurs.


## Créer un modèle de données

Pour s'assurer que deux utilisateur ne peuvent pas utiliser la même adresse e-mail, 
nous utiliserons le `mot clé unique pour l'attribut email du schéma d'utilisateur userSchema`.
Les erreurs générées par défaut par MongoDB pouvant être difficiles à résoudre, 
nous installerons un `package de validation pour pré-valider les informations avant de les enregistrer `:

    npm install --save mongoose-unique-validator

Ce package une fois installé, nous pouvons créer notre propre modèle utilisateur :

dans `models/user.js`

    const mongoose = require('mongoose');

    /** pré-valider les informations avant de les enregistre pour des attributs qui on le mot clé unique */
    const uniqueValidator = require('mongoose-unique-validator');

    const userSchema = mongoose.Schema({
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true }
    });

    /** 
    * on peut utiliser la package uniqueValidator 
    * dans le modèle userSchema 
    * grace à la méthode .plugin() 
    */
    userSchema.plugin(uniqueValidator);

    module.exports = mongoose.model('User', userSchema);

Dans notre schéma, la `valeur unique , avec l'élément mongoose-unique-validator passé comme plug-in`, 
s'assurera qu'aucun des deux utilisateurs ne peut partager la même adresse e-mail.