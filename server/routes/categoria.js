const express = require('express');

const { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion');

const app = express();

const Categoria = require('../models/categoria');


// ============================
// Mostrar todas las categorias
// ============================

app.get('/categoria', verificaToken, (req, res) => {

    Categoria.find({})
        .sort('nombre')
        .populate('usuario', 'nombre email')
        .exec((err, categorias) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            };

            Categoria.count({ estado: true }, (err, conteo) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                };

                res.json({
                    ok: true,
                    categorias,
                    cuantos: conteo
                });
            })


        });

});





// ============================
// Mostrar una categoria por ID
// ============================

app.get('/categoria/:id', [verificaToken], (req, res) => {

    let categoriaId = req.params.id;

    Categoria.findById(categoriaId, (err, categoriaDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        };

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El Id no es correcto'
                }
            });
        };

        res.json({
            ok: true,
            categoria: categoriaDB
        });
    })



});





// ============================
// Crear nueva categoria 
// ============================

app.post('/categoria', [verificaToken], function(req, res) {

    let body = req.body;
    let usuarioId = req.usuario._id;

    function capitalize(string, excludes = ['i', 'l', 'da', 'das', 'de', 'do', 'dos', 'e', 'o', 'a', 'la', 'en', 'el', 'del', 'dels']) {

        const exclude = element => excludes.find(exclude => exclude === element);

        let str = string;
        let res = str.toLowerCase();

        if (res.includes(' '))

            return res.split(' ').map(element =>
            element = exclude(element) ? element : element.charAt(0).toUpperCase() + element.slice(1)).join(' ');

        else
            return res.charAt(0).toUpperCase() + res.slice(1);
    }

    let categoria = new Categoria({
        nombre: capitalize(body.nombre),
        usuario: usuarioId
    });


    categoria.save((err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        };
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        };

        res.json({
            ok: true,
            categoria: categoriaDB,
            usuario: usuarioId
        });
    });

    // Regresa la nueva categoria
    // req.usuario._id
});


// ============================
// Modifica nueva categoria 
// ============================

app.put('/categoria/:id', verificaToken, (req, res) => {



    function capitalize(string, excludes = ['i', 'l', 'da', 'das', 'de', 'do', 'dos', 'e', 'o', 'a', 'la', 'en', 'el', 'del', 'dels']) {

        const exclude = element => excludes.find(exclude => exclude === element);

        let str = string;
        let res = str.toLowerCase();

        if (res.includes(' '))

            return res.split(' ').map(element =>
            element = exclude(element) ? element : element.charAt(0).toUpperCase() + element.slice(1)).join(" ");
        else
            return res.charAt(0).toUpperCase() + res.slice(1);
    }

    let categoriaId = req.params.id;
    let categoria = {
        nombre: capitalize(req.body.nombre)
    }



    Categoria.findByIdAndUpdate(categoriaId, categoria, { new: true, /*uniqueValidators: true*/ }, function(err, categoriaDB) {
        if (err) {
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'Categoria ya existente' //no funcioma uniqueValidators
                }
            });
        };
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        };
        res.json({
            ok: true,
            nombreCategoria: categoriaDB
        });

    });
});

// ============================
// Borrar nueva categoria 
// ============================

app.delete('/categoria/:id', [verificaToken, verificaAdmin_Role], (req, res) => {

    let categoriaId = req.params.id;


    Categoria.findByIdAndRemove(categoriaId, (err, categoriaToRemove) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        };

        if (!categoriaToRemove) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Categoria no encontrada'
                }
            });
        }
        res.json({
            ok: true,
            categoria: categoriaToRemove,
            message: 'Categoria Borrada'
        })

    })

    // Solo un admin puede borrar
    // Categoria.findByIdAndRemove
});


module.exports = app