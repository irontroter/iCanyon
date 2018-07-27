const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let favoritoSchema = new Schema({
    canyon: { type: Schema.Types.ObjectId, ref: 'Canyon' },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' },
    valorCanyon: { type: Boolean, default: false }
});

module.exports = mongoose.model('Favorito', favoritoSchema);