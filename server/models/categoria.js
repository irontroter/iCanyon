const mongoose = require('mongoose');
// const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let categoriaSchema = new Schema({
    nombre: {
        type: String,
        unique: true,
        required: [true, 'El nombre es necesario']
    },

    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    }
});

// categoriaSchema.plugin(uniqueValidator, { message: 'Existe otra categoria con el mismo nombre' });

module.exports = mongoose.model('Categoria', categoriaSchema);