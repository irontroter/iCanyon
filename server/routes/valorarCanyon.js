const express = require('express')

const { verificaToken } = require('../middlewares/autenticacion');

const app = express();
const ValorarCanyon = require('../models/valorarCanyon');
const Canyon = require('../models/canyon')

// ==========================
// Valorar por id canyon
// ==========================
app.post('/canyon/valorarCanyon/:id', verificaToken, (req, res) => {

    let canyonId = req.params.id;
    let body = req.body;
    let usuarioId = req.usuario._id

    let valorarCanyon = {
        canyon: canyonId,
        usuario: usuarioId,
        valorCanyon: Number(body.valorCanyon),
        valorado: true
    };

    if (valorarCanyon.valorCanyon > 5 || valorarCanyon.valorCanyon < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'El valor tiene que ser entre 0 y 5'
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
        let valorCanyonDB = canyonDB.valorCanyon;


        ValorarCanyon.findOneAndUpdate({ usuario: usuarioId, canyon: canyonId }, valorarCanyon, { new: false, upsert: true }, (err, valorarCanyonDB) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            };

            // NO existe valoración anterior

            if (!valorarCanyonDB) {

                let voto = valorarCanyon.valorCanyon;
                let total = (Number(valorCanyonDB[1])) + 1;
                let sumaVotos = Number(valorCanyonDB[0]) * Number(valorCanyonDB[1]) + voto;
                let votoMedia = sumaVotos / total;
                let votoMediaDecimal = votoMedia.toFixed(1);
                let nuevoValorCanyonDB = [votoMediaDecimal, total];

                Canyon.findOneAndUpdate({ _id: canyonId }, { valorCanyon: nuevoValorCanyonDB }, { new: true }, (err, newCanyonDB) => {
                    if (err) {
                        return res.status(500).json({
                            ok: false,
                            err
                        });
                    };

                    return res.status(201).json({
                        ok: true,
                        valorarCanyon,
                        canyon: newCanyonDB
                    });
                });
            } else {

                // Existe valoración anterior

                let voto = valorarCanyon.valorCanyon;
                let votoExistente = Number(valorarCanyonDB.valorCanyon);
                let total = Number(valorCanyonDB[1]);
                let votoMedia = (Number(valorCanyonDB[0]) * Number(valorCanyonDB[1]) - votoExistente + voto) / total;
                let votoMediaDecimal = votoMedia.toFixed(1);
                let nuevoValorCanyonDB = [votoMediaDecimal, total];

                Canyon.findOneAndUpdate({ _id: canyonId }, { valorCanyon: nuevoValorCanyonDB }, { new: true }, (err, newCanyonDB) => {

                    if (err) {
                        return res.status(500).json({
                            ok: false,
                            err
                        });
                    };

                    return res.status(201).json({
                        ok: true,
                        valorarCanyon,
                        valorCanyon: newCanyonDB.valorCanyon,
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

app.get('/canyon/valorarCanyon/:id', verificaToken, (req, res) => {

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

        ValorarCanyon.findOne({ canyon: canyonId, usuario: usuarioId })
            .populate('usuario', 'nombre')
            .populate('canyon', 'nombre valorCanyon')
            .exec((err, valorarCanyonDB) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                };

                if (!valorarCanyonDB) {
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
                    valorarCanyonDB
                })
            })
    });
});

module.exports = app