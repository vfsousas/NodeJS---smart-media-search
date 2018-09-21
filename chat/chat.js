const express = require('express')
const ObjectId = require('mongodb').ObjectID
var TextToSpeechV1 = require('watson-developer-cloud/text-to-speech/v1');
var fs = require('fs');

const router = express.Router()
const ConversationV1 = require('watson-developer-cloud/conversation/v1');
const database = require('../data/db')
const moviesHelpers = require('./getMovies')
const db = database.getDB();
 
const conversation = new ConversationV1({
  username: "49cc10d2-de48-46b9-b091-825760709be5",
  password: 'BgD07dh4dgHZ',
  version: 'v1',
  version_date:'2017-05-26'
});


router.get('/', function(req, res, next){
   res.render('app_sms')
})


router.get('/getmovie', function(req, res, next){
    moviesHelpers.getSingleMovie(req.query.movie, function(movie) {
        res.json(movie)
    })    
})

router.get('/message', function(req, res, next){
    let msg = req.query.msg
    
    conversation.message({
        input: { text: msg },
        workspace_id: 'a1bf7274-8378-4acb-8f21-a79a78e58085'
    }, function(err, response) {
        if (err) {
            res.send(err)
        } else {

            let searchCriteria;
            if(typeof response.entities[0] != "undefined"){
                searchCriteria = {
                    entity: response.entities[0].entity,
                    value: response.entities[0].value 
                }
            } else {
                searchCriteria = {
                    entity: "",
                    value: "" 
                }
            }            

            moviesHelpers.getMovies(searchCriteria, function(moviesList) {
                let = filename = "output" + Date.now() + ".mp3"
                let result = {
                    moviesList: moviesList,
                    watsonMessage: response.output.text[0],
                    filename
                }

                var text_to_speech = new TextToSpeechV1({
                    username: 'b8b80f7e-48fa-4c30-8f75-ac676b12b844',
                    password: 'JG4QPb4ZjWpi'
                });
                
                var params = {
                    text: result.watsonMessage,
                    voice: 'en-US_AllisonVoice', // Optional voice 
                    accept: 'audio/wav'
                };
 
                // Pipe the synthesized text to a file 
                text_to_speech.synthesize(params).pipe(fs.createWriteStream("./public/" + filename))
                
                res.json(result)
                


            })    

        }
    })
})


router.get('/delfile', function(req, res, next){
    fs.unlink("./public/" + req.query.file, (err) => {
        if (err) {
            console.log("failed to delete local image:"+err);
        } else {
            console.log('successfully deleted local image');                                
        }
    })
})


module.exports = router