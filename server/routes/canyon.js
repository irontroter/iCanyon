const express = require('express');

const { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion');

const app = express();

const Canyon = require('../models/canyon');

const path = require('path');

var NodeGeocoder = require('node-geocoder');

// ============================
// functions
// ============================

function capitalize(string, excludes = ['i', 'l', 'da', 'das', 'de', 'do', 'dos', 'e', 'o', 'a', 'la', 'en', 'el', 'del', 'dels']) {

    const exclude = element => excludes.find(exclude => exclude === element);

    let str = string;
    let res = str.toLowerCase();

    if (res.includes(' '))

        return res.split(' ').map(element =>
        element = exclude(element) ? element : element.charAt(0).toUpperCase() + element.slice(1)).join(" ");
    else
        return res.charAt(0).toUpperCase() + res.slice(1);
};

// =============================
// encontrar geo
// =============================

var options = {
    provider: 'google',

    // Optional depending on the providers
    httpAdapter: 'https', // Default
    apiKey: '', // for Mapquest, OpenCage, Google Premier
    formatter: null // 'gpx', 'string', ...
};

const geocoder = NodeGeocoder(options);


// ============================
// Mostrar todos los canyons
// ============================

app.get('/canyons', verificaToken, (req, res) => {

    Canyon.find({})
        .sort('nombre')
        .populate('usuario', 'nombre email')
        // .populate('valorarCanyon', 'valorCanyon')
        .exec((err, canyons) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            };

            Canyon.count({ estado: true }, (err, conteo) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                };

                res.json({
                    ok: true,
                    canyons,
                    cuantos: conteo
                });
            })


        });

});


// ============================
// Mostrar un canyon por ID
// ============================

app.get('/canyon/:id', [verificaToken], (req, res) => {

    let canyonId = req.params.id;

    Canyon.findById(canyonId)
        .populate('usuario', 'nombre email')
        .exec((err, canyonDB) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            };

            if (!canyonDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'El Id no es correcto'
                    }
                });
            };

            res.json({
                ok: true,
                canyon: canyonDB
            });
        })
});

// ============================
// Crear nuevo canyon 
// ============================

app.post('/canyon', [verificaToken], function(req, res) {

    let body = req.body;
    let usuarioId = req.usuario._id;

    geocoder.reverse({ lat: body.lat, lon: body.lng }, function(err, geo) {
        if (err) { return res.status(400).json({ ok: false, err: { message: 'error en encontrar la posicion del canyon' } }) };

        let canyon = new Canyon({
            nombre: capitalize(body.nombre),
            usuario: usuarioId,
            descripcion: body.descripcion,
            loc: [body.lat, body.lng],
            provincia: geo[0].administrativeLevels.level2long,
            region: geo[0].administrativeLevels.level1long,
            pais: geo[0].country
        });

        canyon.save((err, canyonDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            };
            if (!canyonDB) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            };

            res.json({
                ok: true,
                canyon: canyonDB,
                usuario: usuarioId
            });
        });
    });
});

// ============================
// Modifica nuevo canyon 
// ============================

app.put('/canyon/:id', verificaToken, (req, res) => {

    let canyonId = req.params.id;
    let body = req.body;
    let usuarioSession = req.usuario._id;

    geocoder.reverse({ lat: body.lat, lon: body.lng }, function(err, geo) {
        if (err) { return res.status(400).json({ ok: false, err: { message: 'error en encontrar la posicion del canyon' } }) };

        let canyon = {
            nombre: capitalize(body.nombre),
            descripcion: body.descripcion,
            loc: [body.lat, body.lng],
            provincia: geo[0].administrativeLevels.level2long,
            region: geo[0].administrativeLevels.level1long,
            pais: geo[0].country
        };

        Canyon.findById(canyonId, (err, canyonDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err: {
                        message: 'Canyon ya existente' //no funcioma uniqueValidators
                    }
                });
            };
            if (!canyonDB) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            };

            if (canyonDB.usuario._id != usuarioSession) {
                return res.status(500).json({
                    ok: false,
                    err: {
                        message: `No puedes modificar la descripción del barranco ${canyonDB.nombre} porque no eres el propietario.`
                    }
                });
            };

            canyonDB.set(canyon);
            canyonDB.save((err, canyonGuardado) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                };

                if (!canyonGuardado) {
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                };

                res.json({
                    ok: true,
                    nombre: canyonGuardado.nombre,
                    usuario: canyonGuardado.usuarioId,
                    descripcion: canyonGuardado.descripcion,
                    loc: canyonGuardado.loc,
                    provincia: canyonGuardado.provincia,
                    region: canyonGuardado.region,
                    pais: canyonGuardado.pais,
                    estado: canyonGuardado.estado,

                });

            });

        })

    });
});

// ============================
// Borrar canyon 
// ============================

app.delete('/canyon/:id', [verificaToken, verificaAdmin_Role], (req, res) => {

    let canyonId = req.params.id;

    Canyon.findByIdAndRemove(canyonId, (err, canyonToRemove) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        };

        if (!canyonToRemove) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Categoria no encontrada'
                }
            });
        }
        res.json({
            ok: true,
            canyon: canyonToRemove,
            message: 'Canyon Borrado'
        })
    })
});

// =============================
// Buscar canyons
// =============================

app.get('/canyons/buscar/:termino', verificaToken, (req, res) => {

    let termino = req.params.termino;
    // expressió regular insensible maj/minúscules
    let regex = new RegExp(termino, 'i');
    // let x = req.params.x;
    // x = ['nombre', 'descripcion', ...];

    Canyon.find({ nombre: regex })
        // .populate('valorarCanyon', 'media')
        .exec((err, canyons) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            };
            res.json({
                ok: true,
                canyons
            })
        })
})


// =============================
// puntos geograficos cercanos
// =============================

app.get('/canyons/buscar/loc/:coord&:min&:max', [verificaToken], (req, res) => {

    var coord = req.params.coord.split(',');
    var min = req.params.min;
    var max = req.params.max;

    Canyon.find({ loc: { $nearSphere: { $geometry: { type: "Point", coordinates: coord }, $minDistance: min, $maxDistance: max } } }, (err, canyons) => {

        if (err) { return res.status(400).json({ ok: false, err }) };
        if (!canyons) { return res.status(400).json({ ok: false, err: { message: 'Categoria no encontrada' } }) };

        res.json(canyons);

    });
});


module.exports = app