const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let canyonSchema = new Schema({
    nombre: { type: String, unique: true, required: [true, 'El nombre es necesario'] },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' },
    descripcion: { type: String, required: [true, 'La descripción es requerida'] },
    valorCanyon: { type: [Number], default: [0, 0] },
    valorDescripcionCanyon: { type: [Number], default: [0, 0] },
    estado: { type: Boolean, default: true },
    loc: { type: [Number], required: true, index: '2dsphere' },
    provincia: { type: String, default: '' },
    region: { type: String, default: '' },
    pais: { type: String, default: '' }
    //pendent afegir més...

});


// categoriaSchema.plugin(uniqueValidator, { message: 'Existe otra categoria con el mismo nombre' });

module.exports = mongoose.model('Canyon', canyonSchema);