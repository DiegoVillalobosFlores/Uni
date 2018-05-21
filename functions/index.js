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
        const anuncios = [];
        const anunciosRef = admin.firestore().collection('anuncios');
        anunciosRef.orderBy('fecha','desc').get()
            .then(anounciosSnapshot => {
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

exports.getAnnouncementComment = functions.https.onRequest((req,res) => {
    const data = {
        announcement: req.query.announcement
    };

    cors(req,res,() => {
        return admin.firestore().collection('anuncios').doc(data.announcement).collection('comments').get()
            .then(commentsSnapshot => {
                const comments = [];
                commentsSnapshot.forEach(commentRef => {
                    const comment = commentRef.data();
                    comment.id = commentRef.id;
                    comments.push(comment)
                });
                return res.status(200).send(comments)
            })
            .catch(error => {
                console.log(error);
                return res.status(400).send(error)
            })
    })
});

exports.postComment = functions.https.onRequest((req,res) => {


    console.log("BODY",req.body);
    const data = {
        comment: req.body.comment,
        announcement: req.query.announcement
    };


    console.log("DATA",data);

    data.comment.date = new Date();

    cors(req,res,() => {
        admin.firestore().collection('anuncios').doc(data.announcement).collection('comments').add(data.comment)
            .then(response => {
                return res.status(200).send({ok: response.id})
            })
            .catch(error => {
                console.log(error);
                return res.status(400).send(error)
            })
    })
});