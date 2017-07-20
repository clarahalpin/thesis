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
			"timestamp_ms": {
				"order": "desc"
			}
		}
		],
		"size":1
	} 
		
	client.search({
		//index:"idx_tweets",
		index: 'user_live_tweets',
		type: 'tweet',
		body: query
	}).then(function (resp) {
		//console.log('response:', resp);

		var response = resp.hits.hits;

		var tweet_array = new Queue();
		var length = 10;
		
		for (i = 0; i < response.length; i++) { 
			var text = response[i]["_source"]["text"];
		    //console.log(text);
		    var username = response[i]["_source"]["user"]["screen_name"];
		    //console.log(username);
		    tweet_array.enqueue({
    			key:   username,
    			value: text
			});
		}

		while (tweet_array > length) {
			tweet_array.dequeue();
		}

		for(var i =0; i<tweet_array.length; i++) {
			var items = document.getElementByID("stack");
			var item = document.createElement("li");
        	item.innerHTML = tweet_array[i];
        	items.appendChild(item);
		}

}, function (err) {
	console.trace(err.message);
});
});

	
