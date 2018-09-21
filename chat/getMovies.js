const express = require('express')
const database = require('../data/db')
const db = database.getDB()

function getMovies(criteria, callback){
    let search;

    if(criteria.entity == ""){
        search = {}
    } else if (criteria.entity == "actors"){
        let regex = new RegExp(["^", criteria.value, "$"].join(""), "i");
        search = {"cast": regex}
    } else {
        search = {"genre": criteria.value}
    }
    
    db
        .then( db => db.collection('movies').find( search ).sort( {"rating": -1} ).limit(3).toArray() )
        .then(movies => {
            callback(movies)
        })
        .catch(e => {
            console.log(e)
            throw new Error(e)
        })
}

function getSingleMovie(title, callback){    
    db
        .then( db => db.collection('movies').find({"title": title} ).toArray() )
        .then(movie => {
            callback(movie)
        })
        .catch(e => {
            console.log(e)
            throw new Error(e)
        })
}

module.exports = {getMovies, getSingleMovie}