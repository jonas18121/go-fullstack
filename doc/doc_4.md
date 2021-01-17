# Créer une route GET

Notre application front-end doit s'exécuter dans un navigateur. Exécutez donc ng serve à partir du répertoire front-end, accéder à http://localhost:4200 avec notre navigateur puis cliquez sur « Parties 1 + 2 ».

## Remettre des articles en vente

On remarque que l'application front-end affiche actuellement un spinner et indique une erreur dans la console.
Cela est dû au fait qu'elle tente d'accéder à notre API et essaye de récupérer les articles en ventes mais tous ça n'exite pas encore dans notre back-end.

dans `app.js` on va mettre le code suivant

    /* 
        Le premier argument est la route ( endpoint ) qui permettra de recevoir le contenu de la constante stuff
        l'addresse absolue est pour l'instant : 'http://localhost:3000/api/stuff',
        notre partie front-end pourra recupéré le contenu de la constante stuff, a cette adresse absolue
    */
    app.use('/api/stuff', (request, response, next) => {
        const stuff = [
            {
                _id: 'oeihfzeoi',
                title: 'Mon premier objet',
                description: 'Les infos de mon premier objet',
                imageUrl: 'https://cdn.pixabay.com/photo/2019/06/11/18/56/camera-4267692_1280.jpg',
                price: 4900,
                userId: 'qsomihvqios',
            },
            {
                _id: 'oeihfzeomoihi',
                title: 'Mon deuxième objet',
                description: 'Les infos de mon deuxième objet',
                imageUrl: 'https://cdn.pixabay.com/photo/2019/06/11/18/56/camera-4267692_1280.jpg',
                price: 2900,
                userId: 'qsomihvqios',
            },
        ];
        response.status(200).json(stuff);
    });

La première différence qu'on remaerque est l'argument supplémentaire passé à la méthode `use`, 
On souhaite lui passé un string, correspondant à la route pour laquelle nous souhaitons enregistrer cet élément de middleware.
Dans ce cas, cette route sera http://locahost:3000/api/stuff , qui porra être demandé par l'application front-end.

Dans ce middleware, nous créons un groupe d'articles avec le schéma de données spécifique requis par le front-end. 
Nous envoyons ensuite ces articles sous la forme de données JSON, avec un code 200 pour une demande réussie.

Si on effectue cette route ( http://locahost:3000/api/stuff ) ur postman, on recevera le contenu de la constante stuff.
Par contre dans le navigateur a cette adresse ( http://localhost:4200/part-one/all-stuff ), 
il y aura toujours le spinner et toujours cette erreur dans la console du navigateur :

    Access to XMLHttpRequest at 'http://localhost:3000/api/stuff' from origin 'http://localhost:4200' 
    has been blocked by CORS policy: Response to preflight request doesn't pass access control check: 
    No 'Access-Control-Allow-Origin' header is present on the requested resource.

Que ce passe t'il exactement ici ?

## Erreur de CORS

`CORS signifie "Cross Origin Resource Sharing"` , Il s'agit d'un système de sécurité qui, par défault,
empêche les HTTP d'être effectuées entre des serveurs différents, ce qui empêche les requètes malveillantes d'accéder à des ressource sensibles. 
`Dans notre cas, nous avons 2 origin différents : localhost:3000 et localhost:4200` et on veut qu'elles puisse communiquer entre elles.
Pour ce la nous devons ajouter des headers à notre objet response.

Dans `app.js` on va ajouter le middleware avant l'autre middleware qui contient une route d'API


    const express = require('express');

    const app = express();

    /**
    * Dans ce middleware, on ne met pas de route en premier argument, 
    * afin que tous les autres middleware puisse en bénéficier de ce header
    * et on aura plus d'erreurs de CORS
    */
    app.use((request, response, next) => {
        response.setHeader('Access-Control-Allow-Origin', '*');
        response.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
        response.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
        next();
    });

    /* 
        Le premier argument est la route ( endpoint ) qui permettra de recevoir le contenu de la constante stuff
        l'addresse absolue est pour l'instant : 'http://localhost:3000/api/stuff',
        notre partie front-end pourra recupéré le contenu de la constante stuff, a cette adresse absolue
    */
    app.use('/api/stuff', (request, response, next) => {
        
        const stuff = [
            {
            _id: 'oeihfzeoi',
            title: 'Mon premier objet',
            description: 'Les infos de mon premier objet',
            imageUrl: 'https://cdn.pixabay.com/photo/2019/06/11/18/56/camera-4267692_1280.jpg',
            price: 4900,
            userId: 'qsomihvqios',
            },
            {
            _id: 'oeihfzeomoihi',
            title: 'Mon deuxième objet',
            description: 'Les infos de mon deuxième objet',
            imageUrl: 'https://cdn.pixabay.com/photo/2019/06/11/18/56/camera-4267692_1280.jpg',
            price: 2900,
            userId: 'qsomihvqios',
            },
        ];

        response.status(200).json(stuff);
    });


    module.exports = app;


Ces headers permettent :

    - d'accéder à notre API depuis n'importe quelle origine ( '*' )
    - d'ajouter les headers mentionnés aux requêtes envoyées vers notre API ( 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization' )
    - d'envoyer des requêtes avec les méthodes mentionnées ( 'GET, POST, PUT, DELETE, PATCH, OPTIONS' )

Comme on peut le voir dans le code, le middleware ne prend pas d'adresse en premier paramètre afin de s'appliquer à toutes les routes. 
Cela permettra à toutes les demandes de toutes les origines d'accéder à notre API. 
On peut également ajouter des URL d'images valides aux stuff renvoyés par l'API, en terminant la route GET. Si on actualise à présent l'application front-end, on va voir nos articles en vente :