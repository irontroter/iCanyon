const mongoose = require('mongoose');
// const uniqueValidator = require('mongoose-unique-validator');


let Schema = mongoose.Schema;

let valorarDescripcionCanyonSchema = new Schema({
    canyon: { type: Schema.Types.ObjectId, ref: 'Canyon', required: true },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true },
    valorDescripcionCanyon: { type: Number, min: 1, max: 3, default: 0, required: true },
    valorado: { type: Boolean, default: false },
});

// categoriaSchema.plugin(uniqueValidator, { message: 'Existe otra categoria con el mismo nombre' });

module.exports = mongoose.model('ValorarDescripcionCanyon', valorarDescripcionCanyonSchema);