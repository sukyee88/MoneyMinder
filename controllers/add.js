'use strict';

const Telegram = require('telegram-node-bot');

class AddCtrl extends Telegram.TelegramBaseController{
    addHandler($){

        let newSpend = $.message.text.split(" ").slice(1)
        
        if (!newSpend) return $.sendMessage("Please add your spending by typing /add [amount] [category]");
        
        $.getUserSession('spends')
            .then(spends =>{ 
                if (!Array.isArray(spends)) $.setUserSession('spends', [newSpend]);
            
                else $.setUserSession('spends', spends.concat([newSpend]));
                $.sendMessage("You spent " + newSpend[0] + " for " + newSpend[1]);

        });
    }

    totalHandler($) {
        $.getUserSession('spends').then(spends => {
            $.sendMessage(this._serializeList(spends), { parse_mode: 'Markdown' });
        });
    }
    
    get routes() {
        return {
            'addCommand': 'addHandler',
            'totalCommand': 'totalHandler'
        }
    }

    _serializeList(list) {
        let serialized = '*Your spending:*\n\n';
        list.forEach((t, i) => {
            serialized += `*${i}* - ${t}\n`;
        });
        return serialized;
    }
}
module.exports = AddCtrl;