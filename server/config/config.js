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
    urlDB = 'mongodb://icanyon-user:1a2b3c@ds221631.mlab.com:21631/icanyon'; //  process.env.MONGO_URI; ..borrar valor urlDB anterior
}
process.env.URLDB = urlDB;


//=====================
//Google Client ID
//=====================

process.env.CLIENT_ID = process.env.CLIENT_ID || '905424495770-jpo7j17pb85oj4q279i5700ne7pqiops.apps.googleusercontent.com';


//=====================
//Geocoder 
//=====================

process.env.GOOGLE_API_KEY = process.env.GOOGLE_API_KEY || 'AIzaSyClim-DtBlKfsXQudkkdGH7pz3LG39LXDc'