const express = require('express')
const database = require('../data/db')
const db = database.getDB()
const router = express.Router()
const dataToUpload = require("./movies")

router.get('/load-movies', function(req, res, next){
    dataToUpload.forEach(function(element) {
        db
            .then(db => db.collection('movies').insertOne(element))
            .then(result =>{
                return
            })
            .catch(next)
    });
    res.redirect('/')
})

router.get( '/delete-movies', function( req, res, next ){
    db
        .then( db => db.collection('movies').drop() )
        .then( result =>{
            res.redirect( '/' )
        })
        .catch( next )
})

module.exports = router