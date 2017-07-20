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
			"id": {
				"order": "desc"
			}
		}
		],
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

		
		var length = 10;
		
		for (i = 0; i < response.length; i++) { 
			var text = response[i]["_source"]["text"];
		    //console.log(text);
		    var username = response[i]["_source"]["user"]["screen_name"];
		    //console.log(username);
		    //var index = tweets.map(function(o) { return o.key; }).indexOf(text);
		    //if (index ==-1) {
		    	tweets[text] = username;


		    	// if (tweets.indexOf(item) === -1) {}
		    	// tweets[text] = username;
		    	// 	key:   text,
		    	// 	value: username
		    	// });
		    //}
		}
		console.log(tweets);

		// for(var i =0; i<tweets.length; i++) {

			for (var k in tweets){
    if (tweets.hasOwnProperty(k)) {
    	if (tweets.indexOf(k) < 0) {
    	$('#stack').prepend('<li>' +k+ "<br>" +tweets[k]+ '</li>');
         //alert("Key is " + k + ", value is" + tweets[k]);
    }}
}
			// var items = document.getElementById("stack");
			// var item = document.createElement("li");
			// item.innerHTML = tweet_array[i];
			// items.appendChild(item);
		// }
	// }

}, function (err) {
	console.trace(err.message);
});

};

go();
// setInterval(function () {
// 	go();
// }, 1000);
});



