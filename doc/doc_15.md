# Modifier les routes pour prendre en compte les fichiers

Pour que notre middleware de téléchargement de fichiers fonctionne sur nos routes, nous devrons les modifier, 
car le format d'une requête contenant un fichier du front-end est différent.


## Modifier la route POST

Tout d'abord, ajoutons notre middleware `multer` à notre route `POST` dans notre routeur `stuff`

dans `routeur/stuff.js`

    const express = require('express');
    const router = express.Router();

    const auth = require('../middleware/auth');
    const multer = require('../middleware/multer-config');

    const stuffCtrl = require('../controllers/stuff');

    router.get('/', auth, stuffCtrl.getAllStuff);
    router.post('/', auth, multer, stuffCtrl.createThing);
    router.get('/:id', auth, stuffCtrl.getOneThing);
    router.put('/:id', auth, stuffCtrl.modifyThing);
    router.delete('/:id', auth, stuffCtrl.deleteThing);

    module.exports = router;


`L'ordre des middleware est important, il faut placer multer après auth, sinon cela risque d'enregistrer des images avec des requêtes non authentifier`


Pour gérer correctement la nouvelle requête entrante, nous devons mettre à jour notre contrôleur :

dans `controller/stuff.js`

    exports.createThing = (req, res, next) => {

        const thingObject = JSON.parse(req.body.thing);

        delete thingObject._id;

        const thing = new Thing({
            ...thingObject,
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        });

        thing.save()
            .then(() => res.status(201).json({ message: 'Objet enregistré !'}))
            .catch(error => res.status(400).json({ error }));
    };

`const thingObject = JSON.parse(req.body.thing);` l'objet `Thing (req.body.thing)` est envoyer par le frontend sous forme de chaine de caractère, 
on va l'analyser à l'aide de `JSON.parse()` pour obtenir un objet utilisable.


on va modifier l'url de l'image pour que le coté frontend sache ou aller chercher l'image.
on va creer une url dynamique avec les batik ``

    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`

        ${req.protocol} : http ou https

        :// : faut mettre ça

        ${req.get('host')} : notre serveur hôte, (ici c'est localhost:3000) mais en ploiment ce sera la racine de notre serveur

        /images/ :  notre dossier qui contient les images

        ${req.file.filename} : le nom du fichier

    
Pour ajouter un fichier à la requête, 
le front-end doit envoyer les données de la requête sous la forme form-data, et non sous forme de JSON. 
Le corps de la requête contient une chaîne thing , 
qui est simplement un objet Thing converti en chaîne. Nous devons donc l'analyser à l'aide de JSON.parse() pour obtenir un objet utilisable.

Nous devons également résoudre l'URL complète de notre image, car req.file.filename ne contient que le segment filename . 
Nous utilisons req.protocol pour obtenir le premier segment (dans notre cas 'http' ). Nous ajoutons '://' , 
puis utilisons req.get('host') pour résoudre l'hôte du serveur (ici, 'localhost:3000' ). 
Nous ajoutons finalement '/images/' et le nom de fichier pour compléter notre URL.


Pensez à utiliser la section Partie 4 ! Si vous enregistrez le contrôleur en l'état et testez l'application, 
vous constaterez que presque tout fonctionne. 
Le seul problème que nous avons est l'erreur 404 que nous obtenons lors de la tentative d'extraction de l'image, 
alors que notre URL semble correcte. Que se passe-t-il donc ici ?


En fait, nous effectuons une demande GET vers http://localhost:3000/images/<image-name>.jpg. 
Cela semble simple, mais n'oubliez pas que notre application s'exécute sur localhost:3000 
et nous ne lui avons pas indiqué comment répondre aux requêtes transmises à cette route : 
elle renvoie donc une erreur 404. Pour remédier à cela, nous devons indiquer à notre app.js comment traiter les requêtes vers la route /image , 
en rendant notre dossier images statique.

Il nous faudra une nouvelle importation dans app.js pour accéder au path de notre serveur :

dans `app.js`

    const path = require('path');

De plus, nous ajoutons le gestionnaire de routage suivant juste au-dessus de nos routes actuelles :

dans `app.js`

    app.use('/images', express.static(path.join(__dirname, 'images')));


Cela indique à Express qu'il faut gérer la ressource images de manière statique (un sous-répertoire de notre répertoire de base, __dirname ) 
à chaque fois qu'elle reçoit une requête vers la route /images . 
Enregistrez et actualisez l'application dans le navigateur ; désormais, 
tout devrait fonctionner correctement. Et maintenant, occupons-nous de la route PUT !


## Modifier la route PUT

La modification de notre route PUT est sensiblement plus compliquée, car nous devons prendre en compte deux possibilités : 
l'utilisateur a mis à jour l'image, ou pas.
 Dans le premier cas, nous recevrons l'élément form-data et le fichier. 
 Dans le second cas, nous recevrons uniquement les données JS


Tout d'abord, ajoutons multer comme middleware à notre route PUT :

dans `routes/stuff.js`

    const express = require('express');
    const router = express.Router();

    const auth = require('../middleware/auth');
    const multer = require('../middleware/multer-config');

    const stuffCtrl = require('../controllers/stuff');

    router.get('/', auth, stuffCtrl.getAllStuff);
    router.post('/', auth, multer, stuffCtrl.createThing);
    router.get('/:id', auth, stuffCtrl.getOneThing);
    router.put('/:id', auth, multer, stuffCtrl.modifyThing);
    router.delete('/:id', auth, stuffCtrl.deleteThing);

    module.exports = router;


À présent, nous devons modifier notre fonction modifyThing() pour voir si nous avons reçu ou non un nouveau fichier, et répondre en conséquence :

dans `controller/stuff.js`

    exports.modifyThing = (req, res, next) => {
    const thingObject = req.file ?
        {
            ...JSON.parse(req.body.thing),
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        } : { ...req.body };

    Thing.updateOne({ _id: req.params.id }, { ...thingObject, _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Objet modifié !'}))
        .catch(error => res.status(400).json({ error }));
    };

-------------------------------------------------------------

const thingObject = req.file ?
        {
            ...JSON.parse(req.body.thing),
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        } : { ...req.body };

dans thingObject on met un `ternaire` qui dit que `s'il y a une image lors de la validation de la modification` 
on fait le même traitement qu'on a fait pour la fonction `POST` 
via (...JSON.parse(req.body.thing), et imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}` ) 
sinon s'il n'y a pas d'image on fait les chose normalement via ...req.body


Dans cette version modifiée de la fonction, on crée un objet thingObject qui regarde si req.file existe ou non. 
S'il existe, on traite la nouvelle image ; s'il n'existe pas, on traite simplement l'objet entrant. 
On crée ensuite une instance Thing à partir de thingObject , puis on effectue la modification.


