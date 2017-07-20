$(document).ready(function () {
	var client = new $.es.Client({
		hosts: 'localhost:9212',
		log: 'trace'
	});

	var count = {
		"aggs": {
			"count_by_type": {
				"value_count": {
					"field": "id"
				}
			}
		},
		"size":0
	}

	function go() {
		
		client.search({
			index: 'user_live_tweets',
			type: 'tweet',
			body: count
		}).then(function (resp) {
			//console.log('response:', resp);
			var start = resp.aggregations.count_by_type.value;
			$("#counter").html(start.toFixed(0));
	
	}, function (err) {
		console.trace(err.message);
	});
	
}

go();
setInterval(function () {
				go();
			}, 1000);
});

