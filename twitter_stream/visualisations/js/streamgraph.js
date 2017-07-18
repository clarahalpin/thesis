var datearray = [];
var colorrange =[];

function chart(data, color) {

        if (color == "blue") {
            colorrange = ["#045A8D", "#2B8CBE", "#74A9CF", "#A6BDDB", "#D0D1E6", "#F1EEF6"];
        }
        else if (color == "pink") {
            colorrange = ["#980043", "#DD1C77", "#DF65B0", "#C994C7", "#D4B9DA", "#F1EEF6"];
        }
        else if (color == "orange") {
            colorrange = ["#B30000", "#E34A33", "#FC8D59", "#FDBB84", "#FDD49E", "#FEF0D9"];
        }
        strokecolor = colorrange[0];

        var margin = {top: 20, right: 20, bottom: 30, left: 50},
        width = 600,
        height = 300;

        var parseTime = d3.timeParse("%a %b %d %H:%M:%S %Z %Y");


        // set the ranges
    var x = d3.scaleTime().range([0, width]);
    var y = d3.scaleLinear().range([height, 0]);

    var z = d3.scaleOrdinal()
    .range(colorrange);

var xAxis = d3.axisBottom()
    .scale(x);

var yAxis = d3.axisLeft()
    .scale(y);

var yAxisr = d3.axisLeft()
    .scale(y);

data.forEach(function(d) {
    d.key_as_string = parseTime(d.key_as_string);
    d.doc_count = +d.doc_count;
  });
    var stack = d3.stack()
                .offset(d3.stackOffsetSilhouette)
                (data);
                // .value(function (d) {
                //     return d.values;
                // })
                // .x(function (d) {
                //     return d.key_as_string;
                // })
                // .y(function (d) {
                //     return d.doc_count;
                // });


    var nest = d3.nest()
    .key(function(d) { return d.count_per_user.value; });

var area = d3.area()
    .curve(d3.curveCardinal)
    .x(function(d) { return x(d.key_as_string); })
    .y0(function(d) { return y(d.y0); })
    .y1(function(d) { return y(d.y0 + d.y); });

var svg = d3.select(".streamgraph").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var layers = stack(nest.entries(data);

  x.domain(d3.extent(data, function(d) { return d.key_as_string; }));
  y.domain([0, d3.max(data, function(d) { return d.y0 + d.y; })]);

  svg.selectAll(".layer")
      .data(layers)
    .enter().append("path")
      .attr("class", "layer")
      .attr("d", function(d) { return area(d.values); })
      .style("fill", function(d, i) { return z(i); });


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

  // svg.selectAll(".layer")
  //   .attr("opacity", 1)
  //   .on("mouseover", function(d, i) {
  //     svg.selectAll(".layer").transition()
  //     .duration(250)
  //     .attr("opacity", function(d, j) {
  //       return j != i ? 0.6 : 1;
  //   })})

  //   .on("mousemove", function(d, i) {
  //     mousex = d3.mouse(this);
  //     mousex = mousex[0];
  //     var invertedx = x.invert(mousex);
  //     invertedx = invertedx.getMonth() + invertedx.getDate();
  //     var selected = (d.values);
  //     for (var k = 0; k < selected.length; k++) {
  //       datearray[k] = selected[k].date
  //       datearray[k] = datearray[k].getMonth() + datearray[k].getDate();
  //     }

  //     mousedate = datearray.indexOf(invertedx);
  //     pro = d.values[mousedate].value;

  //     d3.select(this)
  //     .classed("hover", true)
  //     .attr("stroke", strokecolor)
  //     .attr("stroke-width", "0.5px"), 
  //     tooltip.html( "<p>" + d.key + "<br>" + pro + "</p>" ).style("visibility", "visible");
      
  //   })
  //   .on("mouseout", function(d, i) {
  //    svg.selectAll(".layer")
  //     .transition()
  //     .duration(250)
  //     .attr("opacity", "1");
  //     d3.select(this)
  //     .classed("hover", false)
  //     .attr("stroke-width", "0px"), tooltip.html( "<p>" + d.key + "<br>" + pro + "</p>" ).style("visibility", "hidden");
  // })
    
  // var vertical = d3.select(".chart")
  //       .append("div")
  //       .attr("class", "remove")
  //       .style("position", "absolute")
  //       .style("z-index", "19")
  //       .style("width", "1px")
  //       .style("height", "380px")
  //       .style("top", "10px")
  //       .style("bottom", "30px")
  //       .style("left", "0px")
  //       .style("background", "#fff");

  // d3.select(".chart")
  //     .on("mousemove", function(){  
  //        mousex = d3.mouse(this);
  //        mousex = mousex[0] + 5;
  //        vertical.style("left", mousex + "px" )})
  //     .on("mouseover", function(){  
  //        mousex = d3.mouse(this);
  //        mousex = mousex[0] + 5;
  //        vertical.style("left", mousex + "px")});

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
  
    "aggs" : {
      "days" : {
        "date_histogram": {
          "field": "created_at",
            "interval": "day"
        },
      "aggs": {
       "count_per_user" : {
            "cardinality" : { "field" : "user.id" }
        }
    }
      }
    },
  "size":0
}


    client.search({
        index: 'user_live_tweets',
        type: 'tweet',
        body: query
    }).then(function (resp) {
        console.log('response:', resp);

        var days = resp.aggregations.days.buckets;

        chart(days,"blue");
});
});