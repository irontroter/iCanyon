const mongoose = require('mongoose');
// const uniqueValidator = require('mongoose-unique-validator');

let valoresValidos = [0, 1, 2, 3, 4, 5]

let Schema = mongoose.Schema;

let valorarDescripcionCanyonSchema = new Schema({
    canyon: { type: Schema.Types.ObjectId, ref: 'Canyon', required: true },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true },
    valorDescripcionCanyon: { type: Number, enum: valoresValidos, default: 0, unique: true, required: true },
    valorado: { type: boolean, default: false },
});

// categoriaSchema.plugin(uniqueValidator, { message: 'Existe otra categoria con el mismo nombre' });

module.exports = mongoose.model('ValorarCanyon', valorarDescripcionCanyonSchema);