'use strict';


const apiai = require('apiai');
const express = require('express');
const server = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
// const google = require('googleapis');
const dotenv = require('dotenv').load();
const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
const TelegramBot = require('./src/telegrambot');
const TelegramBotConfig = require('./src/telegrambotconfig');
const spendInfo = require('./src/spendInfo');

const REST_PORT = (process.env.PORT || 5000);
const DEV_CONFIG = process.env.DEVELOPMENT_CONFIG == 'true';

const APP_NAME = process.env.APP_NAME;
const APIAI_ACCESS_TOKEN = process.env.APIAI_ACCESS_TOKEN;
const APIAI_LANG = process.env.APIAI_LANG;
// const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;

const DBUSER = process.env.DBUSER;
const DBPASSWORD = encodeURIComponent(process.env.DBPASSWORD);


var baseUrl = "";
if (APP_NAME) {
    // Heroku case
    baseUrl = `https://${APP_NAME}.herokuapp.com`;
} else {
    console.error('Set up the url of your service here and remove exit code!');
    process.exit(1);
}

// mongoose instance connection
// mongoose.Promise = global.Promise;
// var dbUri = "mongodb://"+DBUSER+':'+DBPASSWORD+"@ds223509.mlab.com:23509/moneyminder_test";
// mongoose.connect(dbUri);

// var db = mongoose.connection;
// db.on('error', console.error.bind(console, 'MongoDB connection error:'));
// db.once('open', function() {
// 	console.log("We're connected to mLab")
// });

server.use(bodyParser.urlencoded({extended:true}));
server.use(bodyParser.json());
// server.listen((process.env.PORT || 8000),function(){
// 	console.log("Server is up and listening on port" + process.env.PORT);
// });

// console timestamps
require('console-stamp')(console, 'yyyy.mm.dd HH:MM:ss.l');

const botConfig = new TelegramBotConfig(
    APIAI_ACCESS_TOKEN,
    APIAI_LANG,
    TELEGRAM_TOKEN);

botConfig.devConfig = DEV_CONFIG;

const bot = new TelegramBot(botConfig, baseUrl);
bot.start(() => {
        console.log("Bot started");
    },
    (errStatus) => {
        console.error('It seems the TELEGRAM_TOKEN is wrong! Please fix it.')
    });


const app = express();
app.use(bodyParser.json());

app.get('/', function (req, res) {
  res.send('Use the /webhook endpoint.')
})
app.get('/webhook', function (req, res) {
  res.send('You must POST your request')
})

app.post('/webhook', (req, res) => {
    console.log('POST webhook');

    try {
        bot.processMessage(req, res);
    } catch (err) {
        return res.status(400).send('Error while processing ' + err.message);
    }
});

app.listen(REST_PORT, function () {
    console.log('Rest service ready on port ' + REST_PORT);
});


// PersistentMemoryStorage = require('./adapters/PersistentMemoryStorage'),
// storage = new PersistentMemoryStorage(
//     `${__dirname}/data/userStorage.json`,
//     `${__dirname}/data/chatStorage.json`
// ),

// tg = new Telegram.Telegram(TELEGRAM_TOKEN, {
//     workers: 1,
//     storage: storage
// });

// const gsheet = require('./controllers/gsheet')

// console.log(new Telegram.TextCommand);
// const AddCtrl = require('./controllers/add')
//     , OtherwiseController = require('./controllers/otherwise');

// const addcontrol = new AddCtrl();


// // Defining Telegram commands
// tg.router.when(new Telegram.TextCommand('/add', 'addCommand'), addcontrol)
// .when(new Telegram.TextCommand('/total', 'totalCommand'), addcontrol)
// .otherwise(new OtherwiseController());

// function exitHandler(exitCode) {
//     storage.flush();
//     process.exit(exitCode);
// }

// process.on('SIGINT', exitHandler.bind(null, 0));
// process.on('uncaughtException', exitHandler.bind(null, 1));