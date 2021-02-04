// représente notre controleur pour ce type de routes `/api/stuff`

/** model */
const Thing = require('../models/thing');

const fs = require('fs');


exports.createThing = (request, response, next) => {

    const thingObject = JSON.parse(request.body.thing)

    /** le front-end va renvoyer un id qui ne sera pas le bon , vu que MongoDB va le généré automatiquement
     * on va supprimer l'id du corp de la requète avant de copier l'objet
    */
    delete thingObject._id;

    const thing = new Thing({

        /** raccourcie javascript pour récupérer les données dans le corp du body */
        ...thingObject,

        // url d'image dynamique pour que le front-end puisse le trouver
        imageUrl: `${request.protocol}://${request.get('host')}/images/${request.file.filename}`
    });

    /**
     * .save() enregistre l'objet dans la bdd et re tourne une promise
     * donc faut rajouter .then et .catch
     */
    thing.save()
        .then(() => response.status(201).json({ message: 'Objet enregistré !'}))
        .catch(error => response.status(400).json({ error}))
    ;
}

exports.getOneThing = (request, response, next) => {

    //console.log(response);
    Thing.findOne({ _id: request.params.id })
        .then(thing => response.status(200).json(thing))
        .catch(error => response.status(404).json({error}))
    ;
}


exports.modifyThing = (request, response, next) => {

    const thingObject = request.file ?
        {
            ...JSON.parse(request.body.thing),
            imageUrl: `${request.protocol}://${request.get('host')}/images/${request.file.filename}`
        } : { ...request.body };


    Thing.updateOne({ _id: request.params.id }, { ...thingObject, _id: request.params.id})
        .then(() => response.status(200).json({ message: 'Objet modifié !'}))
        .catch(error => response.status(404).json({ error }))
    ;

}


exports.deleteThing = (request, response, next) => {

    Thing.findOne({ _id: request.params.id })
        .then(thing => {
        
            const filename = thing.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {

                Thing.deleteOne({ _id: request.params.id })
                    .then(() => response.status(200).json({ message: 'Objet supprimé !'}))
                    .catch(error => response.status(400).json({ error }))
                ;
            });
        })
        .catch(error => response.status(500).json({ error }))
    ;
}


exports.getAllStuff = (request, response, next) => {
    
    /* const stuff = [
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
          imageUrl: 'https://www.publicdomainpictures.net/pictures/10000/velka/1536-1249273362hbHb.jpg',
          price: 2900,
          userId: 'qsomihvqios',
        },
    ];

    response.status(200).json(stuff); */

    Thing.find()
        .then(things => response.status(200).json(things))
        .catch(error => response.status(400).json({ error }))
    ;
}