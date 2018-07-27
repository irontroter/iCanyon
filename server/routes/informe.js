const express = require('express')

const { verificaToken } = require('../middlewares/autenticacion');

const app = express();
const Informe = require('../models/informe');
const Foto = require('../models/foto');


// ============================
// Crear un informe 
// ============================

app.post('/informe/:id', verificaToken, (req, res) => {

    let body = req.body;
    let canyonId = req.params.id;
    let usuario = req.usuario._id;

    let informe = new Informe({
        canyon: canyonId,
        usuario: usuario,
        date: body.date,
        caudal: body.caudal,
        descripcion: body.descripcion,
        // activo: body.activo // per si es vol desactivar
    });


    informe.save((err, informeDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        };
        if (!informeDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        };
        res.status(201).json({
            ok: true,
            informe: informeDB
        })
    });
});

// ============================
// Modificar un informe 
// ============================

app.put('/informe/:id', verificaToken, (req, res) => {

    let body = req.body;
    let informeId = req.params.id;

    let informe = {
        date: body.date,
        caudal: body.caudal,
        descripcion: body.descripcion,
        activo: body.activo // per si es vol desactivar
    };

    Informe.findByIdAndUpdate(informeId, informe, { new: true }, (err, informeDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        };
        if (!informeDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        };
        res.status(201).json({
            ok: true,
            informe: informeDB
        })
    });
});

// ============================
// Llista informes per canyonId 
// ============================

app.get('/informes/:canyonId', verificaToken, (req, res) => {

    let canyonId = req.params.canyonId

    Informe.find({ canyon: canyonId, activo: true }, (err, informeDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        };
        if (!informeDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        };
        res.status(201).json({
            ok: true,
            informes: informeDB
        })
    })
});

// ================================
// Listar informe por nombre canyon !!!!repassar!!!!!!!!!!!!!!!!!!!!! 
// ================================

// app.get('/informes/canyon/:canyon', verificaToken, (req, res) => {

//     let canyon = req.params.canyon;

//     let regex = new RegExp(canyon, 'i')

//     Informe.find({ 'canyon': { 'field': 'nombre', 'value': canyon } })
//         // .sort({ totalLikes: -1 })
//         .populate({
//             path: 'canyon',
//             select: 'nombre',
//             // match: { 'nombre': regex },
//             sort: { nombre: 1 }
//         })
//         .exec((err, informesDB) => {
//             if (err) {
//                 return res.status(500).json({
//                     ok: false,
//                     err
//                 });
//             };
//             if (!informesDB) {
//                 return res.status(400).json({
//                     ok: false,
//                     err: {
//                         message: "No hay fotos"
//                     }
//                 });
//             };


//             res.status(201).json({
//                 ok: true,
//                 informes: informesDB
//             })

//         })
// });



// ============================
// Llista informes per data 
// ============================

app.get('/informes', verificaToken, (req, res) => {

    // let regex = new RegExp(canyon, 'i')

    Informe.find({ activo: true })
        .sort({ date: -1 })
        .populate({
            path: 'canyon',
            select: 'nombre',
            // match: { 'nombre': regex },
            // sort: { nombre: 1 }
        })
        .exec((err, informesDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            };
            if (!informesDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: "No hay fotos"
                    }
                });
            };


            res.status(201).json({
                ok: true,
                informes: informesDB
            })

        })

});




module.exports = app