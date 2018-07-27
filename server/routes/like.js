const express = require('express')

const { verificaToken } = require('../middlewares/autenticacion');

const app = express();

const Like = require('../models/like');
const Foto = require('../models/foto');


// ============================
// like foto
// ============================

app.post('/foto/like/:fotoId', verificaToken, (req, res) => {

    let body = req.body;
    let fotoId = req.params.fotoId;
    let usuario = req.usuario._id;
    let like = body.like;

    let newLike = {
        foto: fotoId,
        usuario,
        like
    };

    Like.findOneAndUpdate({ foto: fotoId, usuario }, newLike, { new: true, upsert: true }, (err, likeDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        };
        if (!likeDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        };

        Like.count({ like: true, foto: fotoId }, (err, count) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            };
            if (!count) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            };

            Foto.findById(fotoId, (err, fotoDB) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                };
                if (!fotoDB) {
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                };

                fotoDB.totalLikes = count;
                fotoDB.save((err, newFotoDB) => {
                    if (err) {
                        return res.status(500).json({
                            ok: false,
                            err
                        });
                    };
                    return res.status(201).json({
                        ok: true,
                        like: likeDB,
                        foto: newFotoDB
                    });
                });
            });
        });
    });

});


module.exports = app