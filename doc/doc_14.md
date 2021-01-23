# Accepter les fichiers entrants avec multer

Nous allons implémenter des `téléchargements de fichiers` pour que les utilisateurs puissent `télécharger des images d'articles à vendre`. 
Pour ce faire, nous utiliserons `multer , un package qui nous permet de gérer les fichiers entrants dans les requêtes HTTP. `
Commençons par installer multer et par créer un élément de middleware pour gérer ces fichiers entrants.

## Configurer le middleware de gestion des fichiers

Nous devrons d'abord installer multer dans notre projet :

    - npm install --save multer

Les `images seront enregistrées dans un sous-dossier appelé images,`
on crée ce `dossier images dans le dossier back-end`

Maintenant ont crée un `middleware` dans notre dossier middleware appelé `multer-config.js`

dans `multer-config.js`

    const multer = require('multer');

    const MIME_TYPES = {
        'image/jpg': 'jpg',
        'image/jpeg': 'jpg',
        'image/png': 'png'
    };

    const storage = multer.diskStorage({

        destination: (request, file, callback) => {
            callback(null, 'images');
        },

        filename: (request, file, callback) => {
            const name = file.originalname.split(' ').join('_');
            const extension = MIME_TYPES[file.mimetype]; 
            const newNameImages = name + Date.now() + '.' + extension; 
            callback(null, newNameImages);
        }
    });

    module.exports = multer({storage: storage}).single('image');




Le fichier middleware `multer-config.js` va expliquer a multer :
    
    - comment géré les fichiers, 
    - où les enregistrer, 
    - quel nom de fichier les données


`const storage = multer.diskStorage()` : la `constante storage` représentera l'objet de configuration

`multer.diskStorage()` :  La fonction `diskStorage() de multer` , je veut dire qu'on va enregistrer les images sur le disque, diskStorage() aura besion de 2 élément (`destination: et filename:`)

`destination:` expliquera à multer dans quel dossier il faut enregistrer les fichiers, destination: est une fonction qui prend 3 agruments (`La request, le file  et le callback`)

`callback(null, 'images');` : le premier argument est en `null` pour dire qu'il n'y a pas d'erreur a ce niveau, et le `deuxième argument est le nom du dossier dans lequel on va enregistrer nos fichiers`

`filename:` va dire a multer quel nom de fichier utiliser car on ne va pas utiliser le nom original du fichier car si quelqu'un envoie le même nom de fichier , il y aura confusion (problème).

`const name = file.originalname.split(' ').join('_');` : on récupère le nom original du fichier grace à `file.originalname` ,  
on supprime les éventuels espaces que pourrait contenir ce nom original grace à `.split(' ')`,
et on les remplace par un underscore grace à `.join('_')`

on va devoir appliquer une extension a notre fichier qui a été renommé. 
Mais y a pas accès par contre on a accès à son mine type (`image/jpg, image/jpeg, image/png`)
Don on va utiliser cet mine type pour généré une extension du fichier

`const MIME_TYPES = { 'image/jpg': 'jpg','image/jpeg': 'jpg','image/png': 'png'};` : représent notre dictionnnaire de mine type

`const extension = MIME_TYPES[file.mimetype];` : la ` constante extension`  recevera la nouvelle version de  mine type grace au ` dictionnaire MIME_TYPES[] qu'on a créer` , 
qui lui même ce basera sur le mine type du fichier qui a été envoyer grace a ` file.mimetype` 

`const newNameImages = name + Date.now() + '.' + extension; ` on crée le nom du fichier en entier avec le nouveau nom + la date du jour + un point + le mine type. 

et on le met dans la fonction callback

`module.exports = multer({storage: storage}).single('image');` : puis on exporte tous ça,
on passe a la function `multer()` notre objet storage , 
`.single()` veut dire qu'on veut que des fichier image uniquement


nous créons une constante storage , à passer à multer comme configuration, 
qui contient la logique nécessaire pour indiquer à multer où enregistrer les fichiers entrants :

    la fonction destination indique à multer d'enregistrer les fichiers dans le dossier images ;

    la fonction filename indique à multer d'utiliser le nom d'origine, 
    de remplacer les espaces par des underscores et d'ajouter un timestamp Date.now() comme nom de fichier. 
    Elle utilise ensuite la constante dictionnaire de type MIME pour résoudre l'extension de fichier appropriée ;

nous exportons ensuite l'élément multer entièrement configuré, lui passons notre constante storage et lui indiquons que nous gérerons uniquement les téléchargements de fichiers image.