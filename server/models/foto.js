var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var fotoSchema = new Schema({
    informe: { type: Schema.Types.ObjectId, ref: 'Informe', required: true },
    nombre: { type: String, default: '' },
    img: { type: String, required: true },
    totalLikes: { type: Number }
});

module.exports = mongoose.model('Foto', fotoSchema);