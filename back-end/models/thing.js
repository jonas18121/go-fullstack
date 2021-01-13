const mongoose = require('mongoose');

/**
 * on cée notre schema de données
 * le id sera automatiquement généré par MongoDB
 */
const thingSchema = mongoose.Schema(
    {
        title:          { type: String, required: true },
        description:    { type: String, required: true },
        imageUrl:       { type: String, required: true },
        userId:         { type: String, required: true },
        price:          { type: Number, required: true },
    }
);

/**
 * mongoose.model('le_nom_du_model', le_schema_creer)
 * cette fonction model est importante car c'est grace à elle,
 * qu'on pourra utilisée le shema en base de données
 */
module.exports = mongoose.model('Thing', thingSchema);