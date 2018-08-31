const express = require('express')

const { verificaToken } = require('../middlewares/autenticacion');

const app = express();
const Favorito = require('../models/favorito');
const Informe = require('../models/informe');
const FavoritoInforme = require('../models/favoritoInforme');
// const Canyon = require('../models/canyon');
// const Usuario = require('../models/usuario');
var co = require('co');

// ==========================
// Marcar canyons favoritos
// ==========================
app.post('/canyon/favorito/:canyonId', verificaToken, (req, res) => {

    let usuarioId = req.usuario._id
    let canyonId = req.params.canyonId;
    let body = req.body;
    let marcadoFavorito = body.marcadoFavorito;

    Favorito.findOneAndUpdate({ canyon: canyonId, usuario: usuarioId }, { marcadoFavorito }, { new: true, upsert: true })
        .exec((err, favoritoDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            };
            if (!favoritoDB) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            };

            res.json({
                ok: true,
                favorito: favoritoDB
            });
        });
});

// ==========================
// Ver canyons favoritos
// ==========================

app.get('/canyons/favoritos', verificaToken, (req, res) => {

    let usuarioId = req.usuario._id;

    Favorito.find({ marcadoFavorito: true, usuario: usuarioId }, 'canyon')
        // .populate('usuario', 'nombre img')
        .populate('canyon', 'nombre')
        .exec((err, favoritosDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            };
            if (!favoritosDB) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            };

            res.json({
                ok: true,
                usuario: usuarioId,
                canyons: favoritosDB
            });
        });

});


// =======================================
// Anadir último informe canyons favoritos
// =======================================

app.post('/informes/canyons/favoritos', verificaToken, (req, res) => {

    let usuarioId = req.usuario._id;

    function canyons() {
        return new Promise((resolve, reject) => {
            Favorito.find({ marcadoFavorito: true, usuario: usuarioId }, 'canyon -_id', (err, canyonDB) => {
                resolve(canyonDB)
            })
        })
    }

    function informes(canyonsFavoritos) {
        return new Promise((resolve, reject) => {

            for (let i = 0; i < canyonsFavoritos.length; i++) {
                var informes = [];
                Informe.findOne(canyonsFavoritos[i])
                    .sort({ date: -1 })
                    .limit(1)

                .exec((err, informeDB) => {

                    if (err) {
                        return res.status(500).json({
                            ok: false,
                            err
                        });
                    };

                    informes.push(informeDB);
                    if (canyonsFavoritos.length === informes.length) {
                        resolve(informes)
                    }
                })
            }
        })
    }

    function buscarInformesFavoritosDB(informe) {
        return new Promise((resolve, reject) => {

            FavoritoInforme.findOne({ informe: informe }, (err, resp) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                }
                resolve(resp)
            })
        })
    }

    function grabarInformeDB(favoritoInforme) {
        return new Promise((resolve, reject) => {

            FavoritoInforme.create(favoritoInforme, (err, informe) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                }
                resolve(informe)
            })
        })
    }

    async function guardarInformesFavoritos() {

        let canyonsFavoritos = await canyons();
        let informesFavoritos = await informes(canyonsFavoritos);
        var favoritoInformeSaved = [];
        var favoritoInformeExistente = [];

        for (i = 0; i < informesFavoritos.length; i++) {
            favoritoInforme = {
                usuario: usuarioId,
                informe: informesFavoritos[i]._id,
                leido: false
            };
            var informeFavoritoDB = await buscarInformesFavoritosDB(informesFavoritos[i]._id);
            if (!informeFavoritoDB) {
                // var guardarInformeDB = await grabarInformeDB(favoritoInforme);
                favoritoInformeSaved.push(favoritoInforme)
            } else {
                favoritoInformeExistente.push(favoritoInforme);
            }
            if (favoritoInformeSaved.length + favoritoInformeExistente.length === informesFavoritos.length) {
                FavoritoInforme.find({ usuario: usuarioId })
                    .remove()
                    .exec()
                if (favoritoInformeSaved.length > 0) {
                    for (i = 0; i < favoritoInformeSaved.length; i++) {
                        grabarInformeDB(favoritoInformeSaved[i])
                    }
                }

                if (favoritoInformeExistente.length > 0) {
                    for (i = 0; i < favoritoInformeExistente.length; i++) {
                        grabarInformeDB(favoritoInformeExistente[i])
                    }
                }
                res.json({
                    ok: true,
                    informesGuardados: favoritoInformeSaved,
                    informesExistentes: favoritoInformeExistente
                });
            }
        }
    }
    guardarInformesFavoritos()
})

// ==================================
// Obtener informes canyons favoritos
// ==================================
app.get('/informes/canyons/favoritos', verificaToken, (req, res) => {

    let usuarioId = req.usuario._id;

    FavoritoInforme.find({ usuario: usuarioId })
        // .populate('usuario', 'nombre img')
        //.populate('canyon', 'nombre')
        .exec((err, favoritosDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            };
            if (!favoritosDB) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            };
            for (i = 0; i < favoritosDB.length; i++) {
                favoritosDB[i].leido = true;
                favoritosDB[i].save();
            }
            res.json({
                ok: true,
                usuario: usuarioId,
                informesFavoritos: favoritosDB
            });
        });

});


module.exports = app