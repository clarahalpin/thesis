var margin = {top: 20, right: 20, bottom: 20, left: 20},
    width = 300,
    height = 500;

var format = d3.timeFormat("%m/%d/%y");

function linechart() {
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

  x.domain(d3.extent(data, function(d) { return d.key_as_string; }));
  y.domain(d3.extent(data, function(d) { return d.doc_count; }));

  g.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x))
    .select(".linegraph")
      .remove();

  g.append("g")
      .call(d3.axisLeft(y))
    .append("text")
      .attr("fill", "#000")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", "0.71em")
      .attr("text-anchor", "end")
      .text("Price ($)");

  g.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("stroke-width", 1.5)
      .attr("d", line);

};

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

    var query = {
      "query": {
        "range" : {
          "created_at" : {
            "gte" :"Wed Jun 14 00:00:00 +0000 2017",
            "lt" : "Thu Jun 15 00:00:00 +0000 2017"
          }
        }
      },
      "aggs" : {
        "days" : {
          "date_histogram": {
            "field": "created_at",
            "interval": "hour"
          },
          "aggs": {
           "count_per_user" : {
            "cardinality" : { "field" : "user.id" }
          }
        }
      }
    },
    "size":0
  };

  client.search({
            index: 'user_live_tweets',
            type: 'tweet',
            body: query
        }).then(function (resp) {
            console.log('response:', resp);
            linechart();
            }, function (err) {
            console.trace(err.message);
        });




});