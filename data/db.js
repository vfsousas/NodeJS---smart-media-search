const MongoClient = require("mongodb").MongoClient;
const cfenv = require('cfenv');

const appenv = cfenv.getAppEnv();

let db;

function setConnectionEnv(callback){
    if (appenv.url != ("http://localhost:" + appenv.port)){
        const services = appenv.services;
        const mongodb_services = services["compose-for-mongodb"];
        const credentials = mongodb_services[0].credentials;
        const ca = [new Buffer(credentials.ca_certificate_base64, 'base64')];
        let url = credentials.uri
        let options = { 
            mongos: {
                ssl: true,
                sslValidate: true,
                sslCA: ca,
                poolSize: 1,
                reconnectTries: 1
            }
        }
        callback(url, options)
    } else {
        let url = 'mongodb://127.0.0.1:27017/movies'
        let options = {}
        callback(url, options)
    }
}

function connect(callback){
    //setConnectionEnv(function(url, options){
        MongoClient.connect("mongodb://admin:admin@ds151222.mlab.com:51222/programming")
            .then(database => {
                db = database
                callback(db)
            })
            .catch(e => {
                console.log(e)
                throw new Error(e)
            })
    //})
}


function getDB(){
    return new Promise(function(resolve, reject){
        if(typeof db == 'undefined'){
            connect(function(db){
                resolve(db)
            })
        }
        else {
        resolve(db)
        }
    })
}

function CloseDB(){
    return new Promise(function(resolve, reject){
        if(typeof db == 'undefined'){
            reject('db is not opened')
        }
        else{
            db.close()
            resolve('db closed')
        }
    })
}

module.exports = {getDB, CloseDB}

