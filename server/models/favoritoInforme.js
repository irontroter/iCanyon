const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let favoritoInformeSchema = new Schema({
    // favorito: { type: Schema.Types.ObjectId, ref: 'Favorito' },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' },
    informe: { type: Schema.Types.ObjectId, ref: 'Informe' },
    leido: { type: Boolean, default: false },
});

module.exports = mongoose.model('FavoritoInforme', favoritoInformeSchema);