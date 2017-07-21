$(document).ready(function () {
	var client = new $.es.Client({
		hosts: 'localhost:9212',
		log: 'trace'
	});

	var query = {
  "query": {
    "match_all": {}
  },
  "sort": [
    {
      "created_at": {
        "order": "desc"
      }
    }
  ],
    "size":10
}
	var tweets = [];


	function go() {
		client.search({
		//index:"idx_tweets",
		index: 'user_live_tweets',
		type: 'tweet',
		body: query
	}).then(function (resp) {
		//console.log('response:', resp);

		var response = resp.hits.hits;
		
		for (i = 0; i < response.length; i++) { 
			var text = response[i]["_source"]["text"];
		    //console.log(text);
		    var username = response[i]["_source"]["user"]["screen_name"];
		    //console.log(username);
		    tweets[text] = username;
		}
		console.log(tweets);

		for (var k in tweets){
    		$('#stack').prepend('<li>' +k+ "<br>" +tweets[k]+ '</li>');
    		//console.log(k);
		}

}, function (err) {
	console.trace(err.message);
});

};

go();
// setInterval(function () {
// 	go();
// }, 1000);
});



