var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var informeSchema = new Schema({
    canyon: { type: Schema.Types.ObjectId, ref: 'Canyon', required: true },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true },
    date: { type: Date, default: Date.now, index: true },
    caudal: { type: Number, min: 1, max: 5, required: true, index: true },
    descripcion: { type: String, required: false },
    // fotos: [{ type: Schema.Types.ObjectId, ref: 'Foto', required: true }],
    activo: { type: Boolean, required: true, default: true }
});


module.exports = mongoose.model('Informe', informeSchema);