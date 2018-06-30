//=====================
//Puerto
//=====================

process.env.PORT = process.env.PORT || 3000;

//=====================
//Vencimient Token
//=====================
// 60 segons
// 60 minuts
// 24 hores
// 30 dies x 10 extres

process.env.CADUCIDAD_TOKEN = '48h';


//=====================
//Seed d'autenticació - Token
//=====================

process.env.SEED = process.env.SEED || 'seed-desarrollo-per-verificar-token'



//=====================
//Entorn Heroku/Local
//=====================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';


//=====================
//Base de dades
//=====================

let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/iCanyon'
} else {
    urlDB = process.env.MONGO_URI;
}
process.env.URLDB = urlDB;

//=====================
//Google Client ID
//=====================

process.env.CLIENT_ID = process.env.CLIENT_ID || '344020380409-e197t81gcjoge559m64o1iga9j9ddqih.apps.googleusercontent.com';