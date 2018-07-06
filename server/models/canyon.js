const mongoose = require('mongoose');
// const uniqueValidator = require('mongoose-unique-validator');

// var NodeGeocoder = require('node-geocoder');


// const options = {
//     provider: 'google',

//     // Optional depending on the providers
//     httpAdapter: 'https', // Default
//     apiKey: '', // for Mapquest, OpenCage, Google Premier
//     formatter: null // 'gpx', 'string', ...
// };

// const geocoder = NodeGeocoder(options);



let Schema = mongoose.Schema;

let canyonSchema = new Schema({
    nombre: { type: String, unique: true, required: [true, 'El nombre es necesario'], /*index: { unique: true }*/ },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' },
    descripcion: { type: String, required: [true, 'La descripción es requerida'] },
    // coord: {
    //     lat: { type: Number, required: true },
    //     lng: { type: Number, required: true }
    // },
    valorarCanyon: [{ type: Schema.Types.ObjectId, ref: 'ValorarCanyon' }],
    valorCanyon: { type: Number, default: 0 },
    valorarDescripcionCanyon: [{ type: Schema.Types.ObjectId, ref: 'ValorarDescripcionCanyon' }],
    valorDescripcionCanyon: { type: Number, default: 0 },
    fotos: { type: Schema.Types.ObjectId, ref: 'FotosCanyon' },
    estado: { type: Boolean, default: true },

    loc: { type: [Number], required: true, index: '2dsphere' },
    provincia: { type: String, default: '' },
    region: { type: String, default: '' },
    pais: { type: String, default: '' }
    //pendent afegir més...

});

// canyonSchema.methods.findSituacion = function(lat, lng) {


// let provincia = '';
// let region = '';
// let pais = '';

//     geocoder.reverse({ lat: lat, lon: lng }, (err, res) => {

//         if (err) { return res.status(400).json({ ok: false, err: { message: 'error de findSituacion' } }) };

// return provincia = res[0].administrativeLevels.level2long;
// region = res[0].administrativeLevels.level1long;
// pais = res[0].country;

// console.log(provincia);
// console.log(region);
// console.log(pais);


// let situacionCanyon = {
//     provincia: res[0].administrativeLevels.level2long,
//     region: res[0].administrativeLevels.level1long,
//     pais: res[0].country
// };

// this.model('Canyon').set(situacionCanyon, function(err, canyonDB) {
//     if (err) {
//         return res.status(500).json({
//             ok: false,
//             err
//         });
//     };
//     if (!canyonDB) {
//         return res.status(400).json({
//             ok: false,
//             err
//         });
//     };

//     console.log(canyonDB);

//     return (canyonDB);
// });

// {
//         canyonDB.provincia = provincia;
//         canyonDB.region = region;
//         canyonDB.pais = pais;
//     })


// res.json({
//     provincia: res[0].administrativeLevels.level2long,
//     region: res[0].administrativeLevels.level1long,
//     pais: res[0].country
// });



// });

// }


// canyonSchema.findNear = function(cb) {
//     return this.model('Canyon').find({ geo: { $nearSphere: this.geo, $maxDistance: 0.01 } }, cb);
// }



// categoriaSchema.plugin(uniqueValidator, { message: 'Existe otra categoria con el mismo nombre' });

module.exports = mongoose.model('Canyon', canyonSchema);