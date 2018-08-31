const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let favoritoSchema = new Schema({
    canyon: { type: Schema.Types.ObjectId, ref: 'Canyon' },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' },
    marcadoFavorito: { type: Boolean, default: false },
    // leido: { type: Boolean, default: false },
});

module.exports = mongoose.model('Favorito', favoritoSchema);