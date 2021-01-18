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