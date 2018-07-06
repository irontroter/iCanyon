const mongoose = require('mongoose');
// const uniqueValidator = require('mongoose-unique-validator');

let valoresValidos = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

let Schema = mongoose.Schema;

let valorarCanyonSchema = new Schema({
    canyon: { type: Schema.Types.ObjectId, ref: 'Canyon', required: true },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true },
    valorCanyon: { type: Number, enum: valoresValidos, default: 0, unique: true, required: true },
    valorado: { type: boolean, default: false },
});

// categoriaSchema.plugin(uniqueValidator, { message: 'Existe otra categoria con el mismo nombre' });

module.exports = mongoose.model('ValorarCanyon', valorarCanyonSchema);