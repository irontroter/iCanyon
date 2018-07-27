var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var likeSchema = new Schema({
    foto: { type: Schema.Types.ObjectId, ref: 'Foto', required: true },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true },
    like: { type: Boolean, default: false },

});

module.exports = mongoose.model('Like', likeSchema);