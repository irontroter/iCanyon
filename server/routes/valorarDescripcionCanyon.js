const express = require('express')

const { verificaToken } = require('../middlewares/autenticacion');

const app = express();
const ValorarDescripcionCanyon = require('../models/valorarDescripcionCanyon');
const Canyon = require('../models/canyon')

// ==========================
// Valorar por id canyon
// ==========================
app.post('/canyon/valorarDescripcionCanyon/:id', verificaToken, (req, res) => {

    let canyonId = req.params.id;
    let body = req.body;
    let usuarioId = req.usuario._id

    let valorarDescripcionCanyon = {
        canyon: canyonId,
        usuario: usuarioId,
        valorDescripcionCanyon: Number(body.valorDescripcionCanyon),
        valorado: true
    };

    if (valorarDescripcionCanyon.valorDescripcionCanyon > 3 || valorarDescripcionCanyon.valorDescripcionCanyon < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'El valor tiene que ser entre 0 y 3'
            }
        });
    }

    Canyon.findById(canyonId, (err, canyonDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        };
        if (!canyonDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El ID del canyon no es correcto'
                }
            });
        };

        // valorCanyon en la DB del canyon canyonId [valor medio, total votos]
        let valorDescripcionCanyonDB = canyonDB.valorDescripcionCanyon;


        ValorarDescripcionCanyon.findOneAndUpdate({ usuario: usuarioId, canyon: canyonId }, valorarDescripcionCanyon, { new: false, upsert: true }, (err, valorarDescripcionCanyonDB) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            };

            // NO existe valoración anterior

            if (!valorarDescripcionCanyonDB) {

                let voto = valorarDescripcionCanyon.valorDescripcionCanyon;
                let total = Number(valorDescripcionCanyonDB[1]) + 1;
                let sumaVotos = Number(valorDescripcionCanyonDB[0]) * Number(valorDescripcionCanyonDB[1]) + voto;
                let votoMedia = sumaVotos / total;
                let votoMediaDecimal = votoMedia.toFixed(1);
                let nuevoValorDescripcionCanyonDB = [votoMediaDecimal, total];

                Canyon.findOneAndUpdate({ _id: canyonId }, { valorDescripcionCanyon: nuevoValorDescripcionCanyonDB }, { new: true }, (err, newCanyonDB) => {
                    if (err) {
                        return res.status(500).json({
                            ok: false,
                            err
                        });
                    };

                    return res.status(201).json({
                        ok: true,
                        valorarDescripcionCanyon,
                        canyon: newCanyonDB
                    });
                });
            } else {

                // Existe valoración anterior

                let voto = valorarDescripcionCanyon.valorDescripcionCanyon;
                let votoExistente = Number(valorarDescripcionCanyonDB.valorDescripcionCanyon);
                let total = Number(valorDescripcionCanyonDB[1]);
                let votoMedia = (Number(valorDescripcionCanyonDB[0]) * Number(valorDescripcionCanyonDB[1]) - votoExistente + voto) / total;
                let votoMediaDecimal = votoMedia.toFixed(1);
                let nuevoValorDescripcionCanyonDB = [votoMediaDecimal, total];

                Canyon.findOneAndUpdate({ _id: canyonId }, { valorDescripcionCanyon: nuevoValorDescripcionCanyonDB }, { new: true }, (err, newCanyonDB) => {

                    if (err) {
                        return res.status(500).json({
                            ok: false,
                            err
                        });
                    };

                    return res.status(201).json({
                        ok: true,
                        valorarDescripcionCanyon,
                        valorDescripcionCanyon: newCanyonDB.valorDescripcionCanyon,
                        nombreCanyon: newCanyonDB.nombre
                    });
                });
            }
        });
    });
});


// ======================================================
// Encontrar valoración usuario por id canyon y usario._1
// ======================================================

app.get('/canyon/valorarDescripcionCanyon/:id', verificaToken, (req, res) => {

    let canyonId = req.params.id;
    let usuarioId = req.usuario._id

    Canyon.findById(canyonId, (err, canyonDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        };
        if (!canyonDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El ID del canyon no es correcto'
                }
            });
        };

        ValorarDescripcionCanyon.findOne({ canyon: canyonId, usuario: usuarioId })
            .populate('usuario', 'nombre')
            .populate('canyon', 'nombre valorDescripcionCanyon')
            .exec((err, valorarDescripcionCanyonDB) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                };

                if (!valorarDescripcionCanyonDB) {
                    return res.status(400).json({
                        ok: false,
                        err: {
                            message: 'No se ha valorado el canyon'
                        }
                    });
                };

                // if (valorarCanyonDB.valorCanyon === 0 || valorarCanyonDB.valorCanyon)
                res.json({
                    ok: true,
                    valorarDescripcionCanyonDB
                })
            })
    });
});

module.exports = app