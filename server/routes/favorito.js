const express = require('express')

const { verificaToken } = require('../middlewares/autenticacion');

const app = express();
const Favorito = require('../models/favorito');
// const Canyon = require('../models/canyon');
// const Usuario = require('../models/usuario');

// ==========================
// Marcar canyons favoritos
// ==========================
app.post('/canyon/favorito/:canyonId', verificaToken, (req, res) => {

    let usuarioId = req.usuario._id
    let canyonId = req.params.canyonId;
    let body = req.body;
    let valorCanyon = body.valorCanyon;

    Favorito.findOneAndUpdate({ canyon: canyonId, usuario: usuarioId }, { valorCanyon }, { new: true, upsert: true })
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

    Favorito.find({ valorCanyon: true, usuario: usuarioId }, 'canyon')
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
                canyons: favoritosDB,
            });
        });

});

module.exports = app