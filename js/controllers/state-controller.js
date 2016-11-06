angular.module('serenata-de-amor-visualization').controller('StateController', function ($scope, $http) {

  start_year = 2016;
  start_month = 1;
  
  $scope.update = function(month, year) {
    if (!month) {
      month = 1;
    }
    
    if (!year) {
      year = 2016;
    }
  
    update(month, year);
    
  };
    
  init();
});


var stateData = [];

function init() {
  var svg = d3.select("svg"),
  margin = {top: 20, right: 20, bottom: 30, left: 40},
  width = +svg.attr("width") - margin.left - margin.right,
  height = +svg.attr("height") - margin.top - margin.bottom;

  var x = d3.scaleBand().rangeRound([0, width]).padding(0.1),
  y = d3.scaleLinear().rangeRound([height, 0]);
  
  var g = svg.append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  
  d3.csv("./data/bystate.csv", function(d) {
    stateData.push(d);
    if (d.month == 1 && d.year == 2016) {    
      d.mean = +d.mean;
      return d;
    }
  }, function(error, data) {
    if (error) throw error;
    x.domain(data.map(function(d) { return d.state; }));
    y.domain([0, Math.max.apply(Math, stateData.map(function(d) { 
      return d.mean; 
    }))]);
      
    
    g.append("g")
    .attr("class", "axis axis--x")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));
    
    g.append("g")
    .attr("class", "axis axis--y")
    .call(d3.axisLeft(y).ticks(4).tickFormat(d3.formatPrefix(".1", 1e4)))
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
    .attr("y", function(d) { return y(d.mean); })
    .attr("width", x.bandwidth())
    .attr("height", function(d) { return height - y(d.mean); })
    .on('mouseover', function (d) {
      coordinates = d3.mouse(this);
      d3.select(".relative")
      .style("left", coordinates[0]  + "px")
      .style("top", (coordinates[1] - 60) + "px")
      .select("#info")
      .text(tooltipText(d));
      
      d3.select("#tooltip").classed("hidden", false);
    })
    .on("mouseout", function() {
      d3.select("#tooltip").classed("hidden", true);
    });
  });
}

function tooltipText(d) {
      return 'Mean value: R$ ' + parseFloat(d.mean).toFixed(0) + 
      ' Total value: R$ ' + parseFloat(d.x1).toFixed(0) + 
      ' Number of persons: '+ d.people +
      ' State: ' + d.state;
}

function update(month, year) {

  data = []
  
  for (var i = 0; i < stateData.length; i++) {
    if (stateData[i].month == month && stateData[i].year == year) {
      data.push(stateData[i]);
    }
  }
  
  
  d3.selectAll(".bar").data(data);
  
    
  var svg = d3.select("svg"),
  margin = {top: 20, right: 20, bottom: 30, left: 40},
  width = +svg.attr("width") - margin.left - margin.right,
  height = +svg.attr("height") - margin.top - margin.bottom;
  
  var x = d3.scaleBand().rangeRound([0, width]).padding(0.1),
  y = d3.scaleLinear().rangeRound([height, 0]);
  
  y.domain([0, Math.max.apply(Math, stateData.map(function(d) { return d.mean; }))]);
  // THIS IS THE ACTUAL WORK!
  
  var bars = svg.selectAll(".bar")
  .attr("stroke-width", 4)
  .transition()
  .duration(300)
  .attr("height", function(d) {
    for (var i = 0; i < data.length; i++) {
      if (data[i].state == d.state) {
        return height - y(data[i].mean);
      }
    }
  })
  .attr("transform", function(d) {
    for (var i = 0; i < data.length; i++) {
      if (data[i].state == d.state) {
        return "translate(" + [0, (-this.y.baseVal.value + y(data[i].mean))] + ")"
      }
    }
  })
}
