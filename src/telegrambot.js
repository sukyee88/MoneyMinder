'use strict';
const apiai = require('apiai');
const uuid = require('uuid/v1');
const request = require('request');
const spendInfo = require('./spendInfo');
// const gsheet = require('./gsheet');


// ISSUE: CANNOT FIND GOOGLEAPIS

// create a config file
module.exports = class TelegramBot {

    get apiaiService() {
        return this._apiaiService;
    }

    set apiaiService(value) {
        this._apiaiService = value;
    }

    get botConfig() {
        return this._botConfig;
    }

    set botConfig(value) {
        this._botConfig = value;
    }

    get sessionIds() {
        return this._sessionIds;
    }

    set sessionIds(value) {
        this._sessionIds = value;
    }

    constructor(botConfig, baseUrl) {
        this._botConfig = botConfig;
        var apiaiOptions = {
            language: botConfig.apiaiLang,
            requestSource: "telegram"
        };

        this._apiaiService = apiai(botConfig.apiaiAccessToken, apiaiOptions);
        this._sessionIds = new Map();

        this._webhookUrl = baseUrl + '/webhook';
        console.log('Starting bot on ' + this._webhookUrl);

        this._telegramApiUrl = 'https://api.telegram.org/bot' + botConfig.telegramToken;
    }

    start(responseCallback, errCallback){
        // https://core.telegram.org/bots/api#setwebhook
        request.post(this._telegramApiUrl + '/setWebhook', {
            json: {
                url: this._webhookUrl
            }
        }, function (error, response, body) {

            if (error) {
                console.error('Error while /setWebhook', error);
                if (errCallback){
                    errCallback(error);
                }
                return;
            }

            if (response.statusCode != 200) {
                console.error('Error status code while /setWebhook', body);
                if (errCallback) {
                    errCallback('Error status code while setWebhook ' + body);
                }
                return;
            }

            console.log('Method /setWebhook completed', body);
            if (responseCallback) {
                responseCallback('Method /setWebhook completed ' + body)
            }
        });
    }

    // Use Dialogflow to process message
    processMessage(req, res) {
        if (this._botConfig.devConfig) {
            console.log("body", req.body);
        }

        let updateObject = req.body;

        if (updateObject && updateObject.message) {
            let msg = updateObject.message;

            var chatId;

            if (msg.chat) {
                chatId = msg.chat.id;
            }

            let messageText = msg.text;

            console.log(chatId, messageText);

            if (chatId && messageText) {
                if (!this._sessionIds.has(chatId)) {
                    this._sessionIds.set(chatId, uuid());
                }

                let apiaiRequest = this._apiaiService.textRequest(messageText,
                    {
                        sessionId: this._sessionIds.get(chatId),
                        contexts: []
                    });

                // Receive response from APIAI and create telegram reply 
                // ********* WORKING ON THIS NOW **********
                apiaiRequest.on('response', (response) => {
                    //call a function to perform different actions using response.intent
                    //intent options {spend.add, spend.edit, spend.get}
                    //after action calls the function to write into database
                    //create new variable to carry context.category,context.amount,chatID,sessionID
                    //configure mlab for nosql db
                    let responseIntent = response.result.metadata.intentName;
                    console.log('Intent 1 is', response.result.metadata.intentName);

                    if (responseIntent == "spend.add")
                    {
                        var category = response.result.contexts[0].parameters.category;
                        var amount = response.result.contexts[0].parameters.amount.amount;

                        var spendlog = new spendInfo (
                        {
                            userID: chatId,
                            category: category,
                            amount: amount
                        });

                        spendlog.save(function(err){
                            if (err) return console.log('spendlog: ERROR',err);
                            console.log('Entry added');
                        });

                        console.log('Intent 2 is', responseIntent);
                        console.log('category:',response.result.contexts[0].parameters.category);
                        console.log('amount:',response.result.contexts[0].parameters.amount.amount);
                        console.log('chatID',chatId);
                        console.log('-------------------');




                        request.put(
                            'https://api.mlab.com/api/1/databases/moneyminder_test/collections/test_env?apiKey=mlabkey',
                            {json: { 
                                // date: Date.now(),
                                chatID: spendlog.userID,
                                category: spendlog.category,
                                amount: spendlog.amount
                             }},
                            function (error, response, body) {
                                if (!error && response.statusCode == 200) {
                                    console.log(body)
                                }
                            }
                            console.log("mlab API")
                        );
                        // Using Zapier and Gsheet

                        // request.post(
                        //     'https://hooks.zapier.com/hooks/catch/2717495/advl3c/',
                        //     {json: { 
                        //         chatID: spendlog.userID,
                        //         category: spendlog.category,
                        //         amount: spendlog.amount
                        //      }},
                        //     function (error, response, body) {
                        //         if (!error && response.statusCode == 200) {
                        //             console.log(body)
                        //         }
                        //     }
                        // );
                        

                        // Add new row in Gsheet using GoogleAPI
                        // addrow(spendlog);

                    }

                    
                    // console.log(JSON.stringify(response, null, '  '));


                    // Create bot to Telegram using response
                    if (TelegramBot.isDefined(response.result)) {
                        let responseText = response.result.fulfillment.speech;
                        let responseData = response.result.fulfillment.data;

                        if (TelegramBot.isDefined(responseData) && TelegramBot.isDefined(responseData.telegram)) {

                            console.log('Response as formatted message');

                            let telegramMessage = responseData.telegram;
                            telegramMessage.chat_id = chatId;


                            this.reply(telegramMessage);

                            TelegramBot.createResponse(res, 200, 'Message processed');

                        } else if (TelegramBot.isDefined(responseText)) {
                            console.log('Response as text message');
                            this.reply({
                                chat_id: chatId,
                                text: responseText
                            });
                            TelegramBot.createResponse(res, 200, 'Message processed');

                        } else {
                            console.log('Received empty speech');
                            TelegramBot.createResponse(res, 200, 'Received empty speech');
                        }
                    } else {
                        console.log('Received empty result');
                        TelegramBot.createResponse(res, 200, 'Received empty result');
                    }
                });

                apiaiRequest.on('error', (error) => {
                    console.error('Error while call to api.ai', error);
                    TelegramBot.createResponse(res, 200, 'Error while call to api.ai');
                });
                apiaiRequest.end();
            }
            else {
                console.log('Empty message');
                return TelegramBot.createResponse(res, 200, 'Empty message');
            }
        } else {
            console.log('Empty message');
            return TelegramBot.createResponse(res, 200, 'Empty message');
        }
    }

    // Reply message via Telegram API
    reply(msg) {
        // https://core.telegram.org/bots/api#sendmessage
        request.post(this._telegramApiUrl + '/sendMessage', {
            json: msg
        }, function (error, response, body) {
            if (error) {
                console.error('Error while /sendMessage', error);
                return;
            }

            if (response.statusCode != 200) {
                console.error('Error status code while /sendMessage', body);
                return;
            }

            console.log('Method /sendMessage succeeded');
        });
    }

    static createResponse(resp, code, message) {
        return resp.status(code).json({
            status: {
                code: code,
                message: message
            }
        });
    }

    static isDefined(obj) {
        if (typeof obj == 'undefined') {
            return false;
        }

        if (!obj) {
            return false;
        }

        return obj != null;
    }
}
