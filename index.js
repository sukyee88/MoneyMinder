'use strict';


const apiai = require('apiai');
const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv').load();
const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN; // this is not working properly
const Telegram = require('telegram-node-bot'),



PersistentMemoryStorage = require('./adapters/PersistentMemoryStorage'),
storage = new PersistentMemoryStorage(
    `${__dirname}/data/userStorage.json`,
    `${__dirname}/data/chatStorage.json`
),

tg = new Telegram.Telegram(TELEGRAM_TOKEN, {
    workers: 1,
    storage: storage
});

// const gsheet = require('./controllers/gsheet')

// console.log(new Telegram.TextCommand);
const AddCtrl = require('./controllers/add')
    , OtherwiseController = require('./controllers/otherwise');

const addcontrol = new AddCtrl();


// Defining Telegram commands
tg.router.when(new Telegram.TextCommand('/add', 'addCommand'), addcontrol)
.when(new Telegram.TextCommand('/total', 'totalCommand'), addcontrol)
.otherwise(new OtherwiseController());

function exitHandler(exitCode) {
    storage.flush();
    process.exit(exitCode);
}

process.on('SIGINT', exitHandler.bind(null, 0));
process.on('uncaughtException', exitHandler.bind(null, 1));