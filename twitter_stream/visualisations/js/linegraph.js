var margin = {top: 20, right: 20, bottom: 20, left: 20},
    width = 300,
    height = 500;

var format = d3.timeFormat("%m/%d/%y");
// set the ranges
var x = d3.scaleTime().range([0, width]);
var y = d3.scaleLinear().range([height, 0]);

// define the line
var valueline = d3.line()
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.close); });

// append the svg obgect to the body of the page
// appends a 'group' element to 'svg'
// moves the 'group' element to the top left margin
var svg = d3.select(".linegraph").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

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

});