'use strict';

const Telegram = require('telegram-node-bot');

class AddCtrl extends Telegram.TelegramBaseController{
    addHandler($){
        let newSpend = $.message.text.split(" ").slice(1)
        let newSpendAmount = newSpend[0];
        let newSpendCategory = newSpend[1];
        
        if (!newSpend) return $.sendMessage("Please add your spending by typing /add [amount] [category]");
        
        $.getUserSession('spends')
            .then(spends =>{
                if (!Array.isArray(spends)) $.setUserSession('spends', [newSpend]);
            
                else $.setUserSession('spends', spends.concat([newSpend]));
            
                console.log(spends);
            
                $.sendMessage("You spent " + newSpendAmount + " for " + newSpendCategory);
            
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