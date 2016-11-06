

var svg = d3.select("svg"),
   margin = {top: 20, right: 20, bottom: 30, left: 50},
   width = +svg.attr("width") - margin.left - margin.right,
   height = +svg.attr("height") - margin.top - margin.bottom,
   g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var parseTime = d3.timeParse("%Y-%m");

var x = d3.scaleTime()
   .rangeRound([0, width]);

var y = d3.scaleLinear()
   .rangeRound([height, 0]);

var line = d3.line()
   .x(function(d) { return x(d.date); })
   .y(function(d) { return y(d.x1); });

d3.csv("./data/totalbytime.csv", function(d) {
 d.date = parseTime(d.date);
 d.x1 = + d.x1;
 return d;
}, function(error, data) {
 if (error) throw error;

 x.domain(d3.extent(data, function(d) { return d.date; }));
 y.domain(d3.extent(data, function(d) { return d.x1; }));

 g.append("g")
     .attr("class", "axis axis--x")
     .attr("transform", "translate(0," + height + ")")
     .call(d3.axisBottom(x));

 g.append("g")
     .attr("class", "axis axis--y")
     .call(d3.axisLeft(y).ticks(4).tickFormat(d3.formatPrefix(".0", 1e7)))
   .append("text")
     .attr("fill", "#000")
     .attr("transform", "rotate(-90)")
     .attr("y", 6)
     .attr("dy", "0.71em")
     .style("text-anchor", "end")
     .text("Valor - R$");

 g.append("path")
     .datum(data)
     .attr("class", "line")
     .attr("d", line);
});
