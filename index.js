'use strict';

const Telegram = require('telegram-node-bot'),
    
    tg = new Telegram.Telegram('481181555:AAH8B9GnMdfv0e8ZQqVgIhh9B5XJ86s_-9Y', {
        workers: 1,
        
    });


const AddCtrl = require('./controllers/add')
    , OtherwiseController = require('./controllers/otherwise');

const addcontrol = new AddCtrl();

tg.router.when(new Telegram.TextCommand('/add', 'addCommand'), addcontrol)
.when(new Telegram.TextCommand('/total', 'totalCommand'), addcontrol)
.otherwise(new OtherwiseController());