const express = require('express');
const Q = require('q');
const app = express();
const { verificaToken } = require('../middlewares/autenticacion');

const Foto = require('../models/foto');
const Informe = require('../models/informe');
const path = require('path');
const multer = require('multer');
const fs = require('fs'),
    gm = require('gm'),
    dir = path.resolve(__dirname, `../../uploads`);

const find = require('find');

const gallery = 4;
const extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];
const storage = multer.diskStorage({

    destination: function(req, file, cb) {
        let pathImagen = path.resolve(__dirname, `../../uploads/informes`)
        cb(null, pathImagen)
    },
    filename: function(req, file, cb) {

        let informeId = req.params.id;
        let cortado = file.originalname.toLowerCase().split('.');
        let ext = cortado[cortado.length - 1];

        cb(null, informeId + '-' + new Date().getMilliseconds() + '.' + ext)
    }
});
const upload = multer({ storage: storage });


// ==========================
// Subir fotos
// ==========================

app.post('/upload/informe/:id', verificaToken, upload.array('img'), function(req, res) {

    let informeId = req.params.id;
    let files = req.files;
    console.log(files);
    if (!files || files === undefined) {
        return res.status(500).json({
            ok: false,
            err: {
                message: 'No se ha seleccionado ninguna foto'
            }
        });
    };
    Informe.findById(informeId, (err, informeDB) => {
        if (!informeDB) {
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'No existe ningun informe con este Id'
                }
            });
        }


        let archivosSubidos = files.length;
        let imgs = [];
        let fotos = [];

        let pathImagen2 = path.resolve(__dirname, `../../uploads/informes`);
        var ExpReg = new RegExp(informeId + "\-*")

        find.file(ExpReg, pathImagen2, function(fotosInforme) {

            let numFotosDB = fotosInforme.length - archivosSubidos
                // console.log("numFotosDB: " + numFotosDB);
                // console.log("fotosInforme.length: " + fotosInforme.length);
                // console.log("archivosSubidos: " + archivosSubidos);

            if (fotosInforme.length > gallery) {

                for (i = 0; i < archivosSubidos; i++) {
                    // console.log("borrats: " + files[i].filename);
                    borraArchivo(files[i].filename)
                }

                return res.status(500).json({
                    ok: false,
                    err: {
                        message: `No se pueden subir más de ${gallery} fotos`
                    }
                });
            }

            for (i = 0; i < archivosSubidos; i++) {

                let imagen = files[i].filename;
                imgs.push(imagen);

                let cortado = files[i].filename.split('.');
                let extension = cortado[cortado.length - 1];
                let num = numFotosDB + i + 1;

                if (extensionesValidas.indexOf(extension) < 0) {
                    for (i = 0; i < archivosSubidos; i++) {
                        borraArchivo(files[i].filename)
                    }
                    return res.status(500).json({
                        ok: false,
                        err: {
                            message: 'Los archivos permitidos son aquellos con extensiones: ' + extensionesValidas.join(', ')
                        }
                    });
                }

                gm(dir + `/informes/${imgs[i]}`)
                    .resize(320, 320)
                    .noProfile()
                    .write(dir + `/informes/${imgs[i]}`, function(err) {
                        if (err) return res.status(500).json({
                            ok: false,
                            err: {
                                message: 'No se ha podido reducir la resolución de la foto'
                            }
                        });
                    });

                let foto = new Foto({
                    nombre: 'img' + num,
                    informe: informeId,
                    img: imgs[i],
                    totalLikes: 0
                });
                console.log(foto);
                fotos.push(foto);

            }
            console.log(fotos);

            Q
                .all(fotos.map(foto => foto.save()))
                .then((fotosDB) => {
                    res.status(201).json({
                        ok: true,
                        fotos: fotosDB
                    })
                })
                .catch((err) => {
                    if (err) {
                        return res.status(500).json({
                            ok: false,
                            err
                        });
                    };
                    if (!fotosDB) {
                        return res.status(400).json({
                            ok: false,
                            err
                        });
                    };

                });

        });
    });
});



function borraArchivo(nombreImagen) {
    let pathImagen = path.resolve(__dirname, `../../uploads/informes/${nombreImagen}`)
    if (fs.existsSync(pathImagen)) {
        fs.unlinkSync(pathImagen) //borra string de la imatge 
    }

};




module.exports = app;