'use strict';

const Telegram = require('telegram-node-bot');

class AddCtrl extends Telegram.TelegramBaseController{
    addHandler($){
        let newSpend = $.message.text.split(" ").slice(1)
        let newSpendAmount = newSpend[0];
        let newSpendCategory = newSpend[1];

        
        if (!newSpend) return $.sendMessage("Please add your spending by typing /add [amount] [category]");
        
        $.getUserSession('spends')
            .then(spends =>{ $.setUserSession('spends', [newSpend]);
                if (!Array.isArray(spends)) $.setUserSession('spends', [newSpend]);
            
                else $.setUserSession('spends', spends.concat([newSpend]));
                $.sendMessage("You spent " + newSpendAmount + " for " + newSpendCategory);
                            
                console.log(spends);
            
            
        });
    }
    
    totalHandler($){
        
    }
 
    get routes() {
        return {
            'addCommand': 'addHandler',
            'totalCommand': 'totalHandler'
        }
    }
}
module.exports = AddCtrl;