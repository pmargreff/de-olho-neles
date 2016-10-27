angular.module('serenata-de-amor-visualization').controller('StateController', function ($scope, $http) {
  $scope.update_select = function() {
    update($scope.selection)
  };
    
  init();
});

// var q = d3.queue();
// q.defer(d3.csv, "./data/bystate2015.csv");
// q.awaitAll(init);

var globalData = [];

function init() {
  var svg = d3.select("svg"),
  margin = {top: 20, right: 20, bottom: 30, left: 40},
  width = +svg.attr("width") - margin.left - margin.right,
  height = +svg.attr("height") - margin.top - margin.bottom;
  
  var x = d3.scaleBand().rangeRound([0, width]).padding(0.1),
  y = d3.scaleLinear().rangeRound([height, 0]);
  
  var g = svg.append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  
  d3.csv("./data/bystate2015.csv", function(d) {
    globalData.push(d);
    if (d.month == 1) {    
      d.value = +d.value;
      return d;
    }
  }, function(error, data) {
    if (error) throw error;
    x.domain(data.map(function(d) { return d.state; }));
    y.domain([0, 3.03511499e6]);
    
    g.append("g")
    .attr("class", "axis axis--x")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));
    
    g.append("g")
    .attr("class", "axis axis--y")
    .call(d3.axisLeft(y).ticks(4).tickFormat(d3.formatPrefix(".1", 1e6)))
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", "0.71em")
    .attr("text-anchor", "end")
    .text("Frequency");
    
    g.selectAll(".bar")
    .data(data)
    .enter().append("rect")
    .attr("class", "bar")
    .attr("x", function(d) { return x(d.state); })
    .attr("y", function(d) { return y(d.value); })
    .attr("width", x.bandwidth())
    .attr("height", function(d) { return height - y(d.value); });
  });
}


function update(month) {
  
  data = []
  
  for (var i = 0; i < globalData.length; i++) {
    if (globalData[i].month == month) {
      data.push(globalData[i]);
    }
  }
    
  var svg = d3.select("svg"),
  margin = {top: 20, right: 20, bottom: 30, left: 40},
  width = +svg.attr("width") - margin.left - margin.right,
  height = +svg.attr("height") - margin.top - margin.bottom;
  
  var x = d3.scaleBand().rangeRound([0, width]).padding(0.1),
  y = d3.scaleLinear().rangeRound([height, 0]);
  
  y.domain([0, 3.03511499e6]);
  
  // THIS IS THE ACTUAL WORK!
  var bars = svg.selectAll(".bar")
  .attr("stroke-width", 4)
  .transition()
  .duration(300)
  .attr("height", function(d) {
    for (var i = 0; i < data.length; i++) {
      if (data[i].state == d.state) {
        return height - y(data[i].value);
      }
    }
  })
  .attr("transform", function(d) {
    for (var i = 0; i < data.length; i++) {
      if (data[i].state == d.state) {
        return "translate(" + [0, (-this.y.baseVal.value + y(data[i].value))] + ")"
      }
    }
  })
}
