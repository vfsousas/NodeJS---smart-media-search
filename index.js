const express = require('express')
const bodyParser = require("body-parser")
var cfenv = require('cfenv')
const app = express()
const appEnv = cfenv.getAppEnv();
const chat = require('./chat/chat')
const scripts = require('./data/scripts')

app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')

app.use(express.static(__dirname + '/public'))
app.use(express.static("node_modules/jquery/dist"));

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use('/', chat)
app.use('/scripts', scripts)

const port = appEnv.port
app.listen(port, function(){
    console.log('server started on port ' + port)
})
