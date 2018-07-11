const mongoose = require('mongoose');
// const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let valorarCanyonSchema = {
    canyon: { type: Schema.Types.ObjectId, ref: 'Canyon', required: true },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true },
    valorCanyon: {
        type: Number,
        min: [1, 'El númerp {VALUE} no es valido, el valor debe estar entre 1 y 5'],
        max: [5, 'El númerp {VALUE} no es valido, el valor deve estar entre 1 y 5'],
        default: 0,
        required: true
    },
    valorado: { type: Boolean, default: false }

};

// categoriaSchema.plugin(uniqueValidator, { message: 'Existe otra categoria con el mismo nombre' });

module.exports = mongoose.model('ValorarCanyon', valorarCanyonSchema);