# Modifier et supprimer des données

## Mettez à jour un thing existant

On va ajouter une autre route dans notre application , juste en bas de notre route individuelle. 
Elle répondra aux requ^étes PUT

    app.put('/api/stuff/:id', (req, res, next) => {
`        Thing.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })`
            .then(() => res.status(200).json({ message: 'Objet modifié !'}))
            .catch(error => res.status(400).json({ error }));
    });


traduction de : `Thing.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })`

`{ _id: req.params.id }` = objet de comparaison , pour savoir quel objet on modifie via la fonction updateOne(), l'id a été passé dans l'URL

`...req.body` = spread operator pour récupérer le `Thing qui est dans le corp de la requête

`{ ...req.body, _id: req.params.id }` = on s'assure que l'id du Thing qui est dans le corp de la requète soit la même que le celui qui a été passé dans l'URL


Ci-dessus, nous exploitons la `méthode updateOne()` dans notre modèle Thing . 
Cela nous permet de mettre à jour le Thing qui correspond à l'objet que nous passons comme premier argument. 
Nous utilisons aussi le paramètre id passé dans la demande et le remplaçons par le Thing passé comme second argument.


`L'utilisation du mot-clé new avec un modèle Mongoose crée par défaut un champ_id .`

`Utiliser ce mot-clé générerait une erreur,` car nous tenterions de modifier un champ immuable dans un document de la base de données. Par conséquent, 
nous devons utiliser le paramètre id de la requête pour configurer notre Thing avec le même_id qu'avant.