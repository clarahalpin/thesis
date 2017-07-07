function chart() {
    var margin = {top: 20, right: 40, bottom: 30, left: 30};
    var width = 600 - margin.left - margin.right;
    var height = 400 - margin.top - margin.bottom;

    var x = d3.scaleTime()
                .range([0, width]);

    var y = d3.scaleLinear()
                .range([height - 10, 0]);

    var xAxis = d3.axisBottom()
                .scale(x);

    var yAxis = d3.axisLeft()
                .scale(y);

    var svg = d3.select(".streamgraph").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
            
        svg.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + height + ")")
                .call(xAxis);

        svg.append("g")
                .attr("class", "y axis")
                .attr("transform", "translate(" + width + ", 0)")
                .call(yAxis);

        svg.append("g")
                .attr("class", "y axis")
                .call(yAxis);
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

    chart();
});