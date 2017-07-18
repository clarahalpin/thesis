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

	function go() {
		
		client.search({
			index: 'user_live_tweets',
			type: 'tweet',
			body: query
		}).then(function (resp) {
			console.log('response:', resp);

			var response = resp.hits.hits;

			for (i = 0; i < response.length; i++) { 
				var text = response[i]["_source"]["text"];
			    //console.log(text);
			    var username = response[i]["_source"]["user"]["screen_name"];
			    //console.log(username);
			}
			
			//cache the ticker
			var ticker = $("#ticker");

			var node1 = document.createElement("dt");
    		var textnode1 = document.createTextNode(username);
    		node1.appendChild(textnode1);

    		document.getElementById("ticker").appendChild(node1);

    		var node2 = document.createElement("dd");
    		var textnode2 = document.createTextNode(text);
    		node2.appendChild(textnode2);

    		document.getElementById("ticker").appendChild(node2);
			//$("#counter").html(start.toFixed(0));

			ticker.children().filter("dt").each(function() {
           
    var dt = $(this),
      container = $("<div>");
   
    dt.next().appendTo(container);
    dt.prependTo(container);          
    container.appendTo(ticker);
  });
                 
  //hide the scrollbar
  ticker.css("overflow", "hidden");
         
  //animator function
  function animator(currentItem) {
             
    //work out new anim duration
    var distance = currentItem.height(),
    duration = (distance - Math.abs(parseInt(currentItem.css("marginTop")))) / 0.025;
 
    //animate the first child of the ticker
    currentItem.animate({ marginTop: -distance }, duration, "linear", function() {
             
      //move current item to the bottom     
      currentItem.appendTo(currentItem.parent()).css("marginTop", 0);
 
    //recurse
    animator(currentItem.parent().children(":first"));
    }); 
  };
         
  //start the ticker
  animator(ticker.children(":first"));
	
	}, function (err) {
		console.trace(err.message);
	});
	
}

go();
// setInterval(function () {
// 				go();
// 			}, 1000);
 });
