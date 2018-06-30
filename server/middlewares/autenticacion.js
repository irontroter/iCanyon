const jwt = require('jsonwebtoken');


// =============================
// Verificar Token
// =============================

let verificaToken = (req, res, next) => {

    let token = req.get('token');


    jwt.verify(token, process.env.SEED, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no válido'
                }
            });

        }

        req.usuario = decoded.usuario;
        next();

    });
    // res.json({
    //     token: token
    // });

};

// =============================
// Verificar AdminRole
// =============================

let verificaAdmin_Role = (req, res, next) => {

    let usuario = req.usuario;
    // console.log(usuario);

    if (usuario.role === 'ADMIN_ROLE') {
        next();
    } else {

        return res.status(400).json({
            ok: false,
            err: {
                message: 'Necesitas ser un Administrador para acceder'
            }
        });
    }

};


// =============================
// Verificar Token para imágenes
// =============================

let verificaTokenImg = (req, res, next) => {

    let token = req.query.token;

    jwt.verify(token, process.env.SEED, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no válido'
                }
            });

        }

        req.usuario = decoded.usuario;
        next();
    });

}




module.exports = {
    verificaToken,
    verificaAdmin_Role,
    verificaTokenImg
}