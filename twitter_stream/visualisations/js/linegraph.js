$(document).ready(function () {
	var client = new $.es.Client({
		hosts: 'localhost:9212',
		log: 'trace'
	});

	client.ping({
            // ping usually has a 3000ms timeout
            requestTimeout: 1000
        }, function (error) {
        	if (error) {
        		console.trace('elasticsearch cluster is down!');
        	} else {
        		console.log("elasticsearch is running");
        	}
        });

	var query ={
		"query": {
			"range" : {
				"created_at" : {
					"gte" :"Thu Jun 15 00:00:00 +0000 2017",
					"lt" : "Fri Jun 16 00:00:00 +0000 2017"
				}
			}
		},
		"aggs" : {
			"days" : {
				"date_histogram": {
					"field": "created_at",
					"interval": "hour"
				}}},
     "size":0
        
        
      }    

	client.search({
		index: 'user_live_tweets',
		type: 'tweet',
		body: query
	}).then(function (resp) {
		console.log('response:', resp);

		var days = resp.aggregations.days.buckets;

		console.log(days);

		var margin = {top: 20, right: 20, bottom: 30, left: 50},
		width = 600,
		height = 300;

		var parseTime = d3.timeParse("%a %b %d %H:%M:%S %Z %Y");


	// set the ranges
	var x = d3.scaleTime().range([0, width]);
	var y = d3.scaleLinear().range([height, 0]);

	// define the line
	var valueline = d3.line()
	.x(function(d) { return x(d.key_as_string); })
	.y(function(d) { return y(d.doc_count); });

	// append the svg obgect to the body of the page
	// appends a 'group' element to 'svg'
	// moves the 'group' element to the top left margin
	var svg = d3.select(".linegraph").append("svg")
	.attr("width", width + margin.left + margin.right)
	.attr("height", height + margin.top + margin.bottom)
	.append("g")
	.attr("transform",
		"translate(" + margin.left + "," + margin.top + ")");
	
	days.forEach(function(d) {
		d.key_as_string = parseTime(d.key_as_string);
		d.doc_count = +d.doc_count;
	});
	// Scale the range of the data
	x.domain(d3.extent(days, function(d) { return d.key_as_string; }));
	y.domain([0, d3.max(days, function(d) { return d.doc_count; })]);

	  // Add the valueline path.
	  svg.append("path")
	  .data([days])
	  .attr("class", "line")
	  .attr("d", valueline);

	  // Add the X Axis
	  svg.append("g")
	  .attr("transform", "translate(0," + height + ")")
	  .call(d3.axisBottom(x)
	  	.tickFormat(d3.timeFormat("%H:%M")));

	  // Add the Y Axis
	  svg.append("g")
	  .call(d3.axisLeft(y));
	            // linechart();
	        }, function (err) {
	        	console.trace(err.message);
	        });




});