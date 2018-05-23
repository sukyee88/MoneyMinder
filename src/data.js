const request = require('request');

const mlabkey = process.env.MLAB_TOKEN;

function Name(spendlog){

	var mlabPost = 'https://api.mlab.com/api/1/databases/moneyminder_test/collections/test_env?apiKey='+mlabkey;
	request.post(
	    mlabPost,
	    {json: { 
	        date: Date.now(),
	        chatID: spendlog.userID,
	        category: spendlog.category,
	        amount: spendlog.amount
	     }},
	    function (error, response, body) {
	        if (!error && response.statusCode == 200) {
	            // console.log(body)
	        }
	    }
	);
}



function Name(user, total) {
var mlabGet = 'https://api.mlab.com/api/1/databases/moneyminder_test/collections/test_env?q={"chatID": "'+user+'"}&apiKey='+mlabkey;

request.get(
	{
    url: mlabGet

	},
	function (error, response, body) {
	        if (!error && response.statusCode == 200) {
	            // console.log(body)
	        }
	    }
	);

}