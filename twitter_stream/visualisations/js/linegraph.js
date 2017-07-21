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
					"gte" :"Thu Jun 08 00:00:00 +0000 2017",
					"lt" : "Fri Jun 09 00:00:00 +0000 2017"
				}
			}
		},
		"aggs" : {
			"days" : {
				"date_histogram": {
					"field": "created_at",
					"interval": "hour"
				}
			}
		},
		"size":0
	}    
$('#sandbox-container .input-group.date').datepicker({
    format: "dd/mm/yyyy",
    datesDisabled: ['07/06/2017', '07/21/2017']
});
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

		var format = d3.time.format("%a %b %d %H:%M:%S +0000 %Y");

		// set the ranges
		var x = d3.time.scale().range([0, width]);
		var y = d3.scale.linear().range([height, 0]);

		var xAxis = d3.svg.axis()
					.scale(x)
					.orient("bottom");

		var yAxis = d3.svg.axis()
					.scale(y)
					.orient("left");

		// define the line
		var valueline = d3.svg.line()
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
			d.key_as_string = format.parse(d.key_as_string);
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

		svg.append("g")
        .attr("class", "xaxis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis.tickFormat(d3.time.format("%H:%M")));

		// Add the Y Axis
    	svg.append("g")
        .attr("class", "yaxis")
        .call(yAxis);


	}, function (err) {
	   	console.trace(err.message);
	});
});