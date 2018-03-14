'use strict';


const apiai = require('apiai');
const express = require('express');
const bodyParser = require('body-parser');

const Telegram = require('telegram-node-bot'),
    
    tg = new Telegram.Telegram('481181555:AAH8B9GnMdfv0e8ZQqVgIhh9B5XJ86s_-9Y', {
        workers: 1,
        
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





