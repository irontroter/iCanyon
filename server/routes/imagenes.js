const express = require('express');

// const fs = require('fs');
const path = require('path');
const find = require('find');
const _ = require('lodash');
const filter = require('lodash.filter');
const { verificaToken } = require('../middlewares/autenticacion');
const app = express();
const Foto = require('../models/foto');
const fs = require('fs'),
    gm = require('gm'),
    dir = path.resolve(__dirname, `../../uploads`);
const fileUpload = require('express-fileupload');
app.use(fileUpload());

function borraArchivo(nombreImagen) {
    let pathImagen = path.resolve(__dirname, `../../uploads/informes/${nombreImagen}`)
    if (fs.existsSync(pathImagen)) {
        fs.unlinkSync(pathImagen) //borra string de la imatge 
    }
};


// ==========================
// Modificar una foto
// ==========================

app.put('/foto/:fotoId', verificaToken, (req, res) => {

    let archivo = req.files.foto;
    let fotoId = req.params.fotoId;

    Foto.findByIdAndUpdate(fotoId, { totalLikes: 0 }, (err, fotoDB) => {

        borraArchivo(fotoDB.img);

        //  Use the mv() method to place the file somewhere on your server
        archivo.mv('uploads/informes/' + fotoDB.img, (err) => {
            if (err) {
                return res.status(500).json({

                    ok: false,
                    err
                });
            }
            gm(dir + `/informes/${fotoDB.img}`)
                .resize(320, 320)
                .noProfile()
                .write(dir + `/informes/${fotoDB.img}`, function(err) {
                    if (err) return res.status(500).json({
                        ok: false,
                        err: {
                            message: 'No se ha podido reducir la resolución de la foto'
                        }
                    });
                });


            return res.json({
                ok: true,
                img: fotoDB.img
            })

        })


    });

});


// ==========================
// Listar fotos de un informe
// ==========================

app.get('/fotos/informe/:informeId', verificaToken, (req, res) => {
    let img = req.params.img;
    let pathImagen = path.resolve(__dirname, `../../uploads/informes`);
    let informeId = req.params.informeId;

    var ExpReg = new RegExp(informeId + "\-*")

    find.file(ExpReg, pathImagen, function(fotosInforme) {

        if (!fotosInforme) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: "El informe no tiene fotos"
                }
            });
        };
    });

    Foto.find({ informe: informeId })
        .limit(20)
        .populate('informe', 'canyon caudal')
        .exec((err, fotoDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            };
            if (!fotoDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: "No hay fotos"
                    }
                });
            };

            res.status(201).json({
                ok: true,
                fotos: fotoDB
            })
        })
});


// ==========================
// Obtener una foto
// ==========================

app.get('/foto/:fotoId', verificaToken, (req, res) => {

    let fotoId = req.params.fotoId;

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
                err: {
                    message: "No hay fotos"
                }
            });
        };

        let pathImagen = path.resolve(__dirname, `../../uploads/informes/${fotoDB.img}`);

        if (fs.existsSync(pathImagen)) {
            res.sendFile(pathImagen)
        } else {
            let noImagePath = path.resolve(__dirname, '../assets/no-image.jpg')

            res.sendFile(noImagePath)
        }
    })
});


// ============================
// Listar fotos per totalLikes
// ============================


app.get('/fotos', verificaToken, (req, res) => {

    let canyonId = req.params.canyonId

    Foto.find()
        .sort({ totalLikes: -1 })
        .populate({
            path: 'informe',
            select: 'canyon date',
            populate: {
                path: 'canyon',
                // match: { _id: canyonId },
                select: 'nombre'
            }
        })
        .exec((err, fotosDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            };
            if (!fotosDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: "No hay fotos"
                    }
                });
            };

            res.status(201).json({
                ok: true,
                fotos: fotosDB
            })
        })
});


// ==============================
// Listar fotos por nombre canyon !!repassar
// ==============================

// app.get('/fotos/canyon/nombre/:canyon', verificaToken, (req, res) => {

//     let canyon = req.params.canyon;

//     let regex = new RegExp(canyon, 'i')
//     Foto.find()
//         // .sort({ totalLikes: -1 })
//         .populate({
//             path: 'informe',
//             select: 'canyon date',
//             populate: {
//                 path: 'canyon',

//                 // find: { 'nombre': regex },
//                 // match: { nombre: regex },
//                 select: 'nombre',
//                 sort: { nombre: 1 }
//             }
//         })
//         .exec((err, fotosDB) => {
//             if (err) {
//                 return res.status(500).json({
//                     ok: false,
//                     err
//                 });
//             };
//             if (!fotosDB) {
//                 return res.status(400).json({
//                     ok: false,
//                     err: {
//                         message: "No hay fotos"
//                     }
//                 });
//             };
//             // let nou = fotosDB;
//             console.log(regex)
//                 // newFotosDB = _.without(fotosDB, {
//                 //     informe: { canyon: { nombre: 'null' } }
//                 // });
//             newFotosDB = _.filter(fotosDB, ['informe.canyon.nombre', /peo/i]) //funciona
//                 // newFotosDB = _.filter(fotosDB, {
//                 //     informe: { canyon: { nombre: { $regex: regex } } }
//                 // });
//                 // newFotosDB = _.filter(fotosDB, { nombre: 'img1' }) // funciona
//             console.log(newFotosDB.informe)

//             res.status(201).json({

//                 ok: true,
//                 fotos: newFotosDB
//             })

//         })
// });


module.exports = app;