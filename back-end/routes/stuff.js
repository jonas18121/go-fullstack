// représente notre routeur pour ce type de routes `/api/stuff`

const express = require('express');

// on crée un routeur
const router = express.Router();

/** on récupère notre controleur pour ce type de routes `/api/stuff` */
const stuffController = require('../controllers/stuff');

/** on récupère le middlewrae d'authentification */
const auth = require('../middleware/auth');

/**
 * créer un objet pour la vendre
 * 
 * grace a app.use(bodyParser.json()); qui est dans app.js
 * on aura acces au cors de la requête dans ce middleware en faisant request.body
 * l'application front-end va quand même attendre une réponse.
 * donc il faudra renvoyer une réponse avec un status code et un message json par exemple :
 * response.status(201).json({ message: 'Objet créé !' });
 * 
 * Le dernier middleware d'une chaîne doit renvoyer la réponse au client pour empêcher la requête d'expirer.
 * 
 * 
 * ------------------------------------------------------------------------------------------
 *  const thing = new Thing({
 *
 *       raccourcie javascript pour récupérer les données dans le corp du body 
 *      ...request.body
 *  });
 * 
 * remplace 
 * 
 * const thing = new Thing({
 *
 *       title: request.body.title,
 *       description: request.body.description,
 *       imageUrl: request.body.imageUrl,
 *       userId: request.body.userId,
 *       price: request.body.price,
 *   });
 * 
 * grace aux 3 petits point, appelé spread (...request.body) : 
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax
 */
router.post('/', auth, stuffController.createThing);


/**
 * Afficher un objet précis
 * 
 * dans request.params , on a les paramètre qui on été envoyer , ici c'est l'id
 */
router.get('/:id', auth, stuffController.getOneThing);

/**
 * Modifier un objet précis
 * 
 * dans request.params , on a les paramètre qui on été envoyer , ici c'est l'id
 */
router.put('/:id', auth, stuffController.modifyThing);

/**
 * Supprimer un objet précis
 * 
 * dans request.params , on a les paramètre qui on été envoyer , ici c'est l'id
 */
router.delete('/:id', auth, stuffController.deleteThing);


/* 
 *   afficher tous les objet en ventes
 *
 *  Le premier argument est la route ( endpoint ) qui permettra de recevoir le contenu de la constante stuff
 *   l'addresse absolue est pour l'instant : 'http://localhost:3000/api/stuff',
 *   notre partie front-end pourra recupéré le contenu de la constante stuff, a cette adresse absolue
*/
router.get('/', auth, stuffController.getAllStuff);


module.exports = router;