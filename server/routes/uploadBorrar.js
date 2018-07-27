const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const { verificaToken } = require('../middlewares/autenticacion');

const Usuario = require('../models/usuario');
const Canyon = require('../models/canyon');
const Foto = require('../models/foto');

const fs = require('fs');
const path = require('path');

// default options
app.use(fileUpload());

app.put('/upload/:tipo/:id', verificaToken, (req, res) => {

    let usuario = req.usuario._id;
    let tipo = req.params.tipo;
    let id = req.params.id;

    if (!req.files) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'No se ha seleccionado ningún archivo'
            }
        });
    }

    // Validar tipo
    let tiposValidos = ['usuario', 'informe']
    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            message: 'Los tipos permitidos son ' + tiposValidos.join(', '),
        })


    }
    // console.log(req);
    let archivo = req.files.foto;
    let cortado = archivo.name.split('.');
    let extension = cortado[cortado.length - 1];

    // console.log(archivo);
    // Extensiones permitidas
    let extensionesValidas = ['png', 'jpg', 'gif', 'jpeg']

    if (extensionesValidas.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            message: 'Las extensiones válidas son ' + extensionesValidas.join(', '),
            ext: extension
        })
    }
    // Cambiar nombre archivo

    let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extension}`;
    console.log(tipo);
    console.log(nombreArchivo);

    //  Use the mv() method to place the file somewhere on your server

    archivo.mv(`uploads/${tipo}s/${nombreArchivo}`, (err) => {
        if (err)
            console.log('errrror!');
        return res.status(500).json({

            ok: false,
            err
        });

        // Aquí, imagen cargada

        if (tipo === 'usuario') {
            imagenUsuario(id, res, nombreArchivo);
        } else {
            console.log('function imagenInforme');
            imagenInforme(id, res, nombreArchivo);
        }
    });

});

function imagenUsuario(id, res, nombreArchivo) {
    Usuario.findById(id, (err, usuarioDB) => {
        if (err) {
            borraArchivo(nombreArchivo, 'usuario')
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!usuarioDB) {
            borraArchivo(nombreArchivo, 'usuario')
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'Usuario no existe'
                }
            });
        }
        borraArchivo(usuarioDB.img, 'usuario')


        usuarioDB.img = nombreArchivo;
        usuarioDB.save((err, usuarioGuardado) => {
            res.json({
                ok: true,
                usuario: usuarioGuardado,
                img: nombreArchivo
            })
        });

    });
}
// buscar a Foto por el informeId... retocar
function imagenInforme(id, res, nombreArchivo) {
    console.log('imagenInforme2');
    Informe.findOne({ informe: id }, (err, informeDB) => {
        if (err) {
            borraArchivo(nombreArchivo, 'informe')
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!informeDB) {
            borraArchivo(nombreArchivo, 'informe')
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'Usuario no existe'
                }
            });
        }
        let fotosDB = informeDB.fotos;
        fotosDB = [img1, img2, img3, img4]

        for (i = 0; i < 4; i++) {


        };


        borraArchivo(informeDB.img, 'informes')

        // Foto.findOneAndUpdate({ informe: id }, {img: nombreArchivo}, {new: true, upsert: true}, (err, foto) =>{

        // });

        fotoDB.img = nombreArchivo;
        fotoDB.save((err, fotoGuardada) => {
            res.json({
                ok: true,
                foto: fotoGuardada,
                img: nombreArchivo
            })
        });

    });

}

function borraArchivo(nombreImagen, tipo) {
    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${nombreImagen}`)
    if (fs.existsSync(pathImagen)) {
        fs.unlinkSync(pathImagen) //borra string de la imatge 
    }
}


module.exports = app;