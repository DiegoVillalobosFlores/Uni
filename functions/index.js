const functions = require('firebase-functions');
const admin = require('firebase-admin');
const cors = require('cors')({origin: true});

admin.initializeApp();

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

exports.getAnnouncements = functions.https.onRequest((req,res) => {
    cors(req,res, () => {
        admin.firestore().collection('anuncios').orderBy('fecha','desc').get()
            .then(anounciosSnapshot => {
                const anuncios = [];
                anounciosSnapshot.forEach(anuncioRef => {
                    const anuncio = anuncioRef.data();
                    anuncio.id = anuncioRef.id;
                    anuncios.push(anuncio);
                });
                return res.status(200).send(anuncios)
            })
            .catch(error => {
                console.log(error);
                return res.status(400).send(error)
            })
    })
});