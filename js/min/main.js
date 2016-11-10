/////////////////////////////////////////////////////////
/////////////// The Radar Chart Function ////////////////
/////////////// Written by Nadieh Bremer ////////////////
////////////////// VisualCinnamon.com ///////////////////
/////////// Inspired by the code of alangrafu ///////////
/////////////////////////////////////////////////////////
		
function RadarChart(id, data, options) {
	var cfg = {
	 w: 600,				//Width of the circle
	 h: 600,				//Height of the circle
	 margin: {top: 20, right: 20, bottom: 20, left: 20}, //The margins around the circle
	 levels: 1,				//How many levels or inner circles should there be drawn
	 maxValue: 0, 				//What is the value that the biggest circle will represent
	 labelFactor: 1.25, 			//How much farther than the radius of the outer circle should the labels be placed
	 wrapWidth: 60, 			//The number of pixels after which a label needs to be given a new line
	 opacityArea: 0.35, 			//The opacity of the area of the blob
	 dotRadius: 4, 				//The size of the colored circles of each blog
	 opacityCircles: 0.1, 			//The opacity of the circles of each blob
	 strokeWidth: 2, 			//The width of the stroke around each blob
	 roundStrokes: false,			//If true the area and stroke will follow a round path (cardinal-closed)
	 color: d3.scale.category10()		//Color function
	};
	
	//Put all of the options into a variable called cfg
	if('undefined' !== typeof options){
	  for(var i in options){
		if('undefined' !== typeof options[i]){ cfg[i] = options[i]; }
	  }//for i
	}//if
	
	// convert the nested data passed in
	// into an array of values arrays
	data = data.map(function(d) { return d.values })

	//If the supplied maxValue is smaller than the actual one, replace by the max in the data
	var maxValue = Math.max(cfg.maxValue, d3.max(data, function(i){
		return d3.max(i.map(
			function(o){ return o.value; }
		))
	}));
		
	var allAxis = (data[0].map(function(i, j){return i.axis})),	//Names of each axis
		total = allAxis.length,					//The number of different axes
		radius = Math.min(cfg.w/2, cfg.h/2), 			//Radius of the outermost circle
		Format = d3.format(".0f"),			 	//Percentage formatting
		angleSlice = Math.PI * 2 / total;			//The width in radians of each "slice"
	
	//Scale for the radius
	var rScale = d3.scale.linear()
		.range([0, radius])
		.domain([0, maxValue]);
		
	/////////////////////////////////////////////////////////
	//////////// Create the container SVG and g /////////////
	/////////////////////////////////////////////////////////

	//Remove whatever chart with the same id/class was present before
	d3.select(id).select("svg").remove();
	
	//Initiate the radar chart SVG
	var svg = d3.select(id).append("svg")
			.attr("width",  cfg.w + cfg.margin.left + cfg.margin.right)
			.attr("height", cfg.h + cfg.margin.top + cfg.margin.bottom)
			.attr("class", "radar"+id);
	//Append a g element		
	var g = svg.append("g")
			.attr("transform", "translate(" + (cfg.w/2 + cfg.margin.left) + "," + (cfg.h/2 + cfg.margin.top) + ")");
	
	/////////////////////////////////////////////////////////
	////////// Glow filter for some extra pizzazz ///////////
	/////////////////////////////////////////////////////////
	
	//Filter for the outside glow
	var filter = g.append('defs').append('filter').attr('id','glow'),
		feGaussianBlur = filter.append('feGaussianBlur').attr('stdDeviation','2.5').attr('result','coloredBlur'),
		feMerge = filter.append('feMerge'),
		feMergeNode_1 = feMerge.append('feMergeNode').attr('in','coloredBlur'),
		feMergeNode_2 = feMerge.append('feMergeNode').attr('in','SourceGraphic');

	/////////////////////////////////////////////////////////
	/////////////// Draw the Circular grid //////////////////
	/////////////////////////////////////////////////////////
	
	//Wrapper for the grid & axes
	var axisGrid = g.append("g").attr("class", "axisWrapper");
	
	//Draw the background circles
	axisGrid.selectAll(".levels")
	   .data(d3.range(1,(cfg.levels+1)).reverse())
	   .enter()
		.append("circle")
		.attr("class", "gridCircle")
		.attr("r", function(d, i){return radius/cfg.levels*d;})
		.style("fill", "#CDCDCD")
		.style("stroke", "#CDCDCD")
		.style("fill-opacity", cfg.opacityCircles)
		.style("filter" , "url(#glow)");

	//Text indicating at what % each level is
	axisGrid.selectAll(".axisLabel")
	   .data(d3.range(1,(cfg.levels+1)).reverse())
	   .enter().append("text")
	   .attr("class", "axisLabel")
	   .attr("x", 4)
	   .attr("y", function(d){return -d*radius/cfg.levels;})
	   .attr("dy", "0.4em")
	   .style("font-size", "10px")
	   .attr("fill", "#737373")
	   .text(function(d,i) { return Format(maxValue * d/cfg.levels); });

	/////////////////////////////////////////////////////////
	//////////////////// Draw the axes //////////////////////
	/////////////////////////////////////////////////////////
	
	//Create the straight lines radiating outward from the center
	var axis = axisGrid.selectAll(".axis")
		.data(allAxis)
		.enter()
		.append("g")
		.attr("class", "axis");
	//Append the lines
	axis.append("line")
		.attr("x1", 0)
		.attr("y1", 0)
		.attr("x2", function(d, i){ return rScale(maxValue*1.1) * Math.cos(angleSlice*i); })
		.attr("y2", function(d, i){ return rScale(maxValue*1.1) * Math.sin(angleSlice*i); })
		.attr("class", "line")
		.style("stroke", "white")
		.style("stroke-width", "2px");

	//Append the labels at each axis
	axis.append("text")
		.attr("class", "legend")
		.style("font-size", "11px")
		.attr("text-anchor", "middle")
		.attr("dy", "0.35em")
		.attr("x", function(d, i){ return rScale(maxValue * cfg.labelFactor) * Math.cos(angleSlice*i - Math.PI/2); })
		.attr("y", function(d, i){ return rScale(maxValue * cfg.labelFactor) * Math.sin(angleSlice*i - Math.PI/2); })
		.text(function(d){return d})
		.call(wrap, cfg.wrapWidth);

	/////////////////////////////////////////////////////////
	///////////// Draw the radar chart blobs ////////////////
	/////////////////////////////////////////////////////////
	
	//The radial line function
	var radarLine = d3.svg.line.radial()
		.interpolate("linear-closed")
		.radius(function(d) { return rScale(d.value); })
		.angle(function(d,i) {	return i*angleSlice; });
		
	if(cfg.roundStrokes) {
		radarLine.interpolate("cardinal-closed");
	}
				
	//Create a wrapper for the blobs	
	var blobWrapper = g.selectAll(".radarWrapper")
		.data(data)
		.enter().append("g")
		.attr("class", "radarWrapper");
			
	//Append the backgrounds	
	blobWrapper
		.append("path")
		.attr("class", "radarArea")
		.attr("d", function(d,i) { return radarLine(d); })
		.style("fill", function(d,i) { return cfg.color(i); })
		.style("fill-opacity", cfg.opacityArea)
		.on('mouseover', function (d,i){
			//Dim all blobs
			d3.selectAll(".radarArea")
				.transition().duration(200)
				.style("fill-opacity", 0.1); 
			//Bring back the hovered over blob
			d3.select(this)
				.transition().duration(200)
				.style("fill-opacity", 0.7);	
		})
		.on('mouseout', function(){
			//Bring back all blobs
			d3.selectAll(".radarArea")
				.transition().duration(200)
				.style("fill-opacity", cfg.opacityArea);
		});
		
	//Create the outlines	
	blobWrapper.append("path")
		.attr("class", "radarStroke")
		.attr("d", function(d,i) { return radarLine(d); })
		.style("stroke-width", cfg.strokeWidth + "px")
		.style("stroke", function(d,i) { return cfg.color(i); })
		.style("fill", "none")
		.style("filter" , "url(#glow)");		
	
	//Append the circles
	blobWrapper.selectAll(".radarCircle")
		.data(function(d,i) { return d; })
		.enter().append("circle")
		.attr("class", "radarCircle")
		.attr("r", cfg.dotRadius)
		.attr("cx", function(d,i){ return rScale(d.value) * Math.cos(angleSlice*i - Math.PI/2); })
		.attr("cy", function(d,i){ return rScale(d.value) * Math.sin(angleSlice*i - Math.PI/2); })
		.style("fill", function(d,i,j) { return cfg.color(j); })
		.style("fill-opacity", 0.8);

	/////////////////////////////////////////////////////////
	//////// Append invisible circles for tooltip ///////////
	/////////////////////////////////////////////////////////
	
	//Wrapper for the invisible circles on top
	var blobCircleWrapper = g.selectAll(".radarCircleWrapper")
		.data(data)
		.enter().append("g")
		.attr("class", "radarCircleWrapper");
		
	//Append a set of invisible circles on top for the mouseover pop-up
	blobCircleWrapper.selectAll(".radarInvisibleCircle")
		.data(function(d,i) { return d; })
		.enter().append("circle")
		.attr("class", "radarInvisibleCircle")
		.attr("r", cfg.dotRadius*1.5)
		.attr("cx", function(d,i){ return rScale(d.value) * Math.cos(angleSlice*i - Math.PI/2); })
		.attr("cy", function(d,i){ return rScale(d.value) * Math.sin(angleSlice*i - Math.PI/2); })
		.style("fill", "none")
		.style("pointer-events", "all")
		.on("mouseover", function(d,i) {
			newX =  parseFloat(d3.select(this).attr('cx')) - 10;
			newY =  parseFloat(d3.select(this).attr('cy')) - 10;
					
			tooltip
				.attr('x', newX)
				.attr('y', newY)
				.text("R$ " + Format(d.value))
				.transition().duration(200)
				.style('opacity', 1);
		})
		.on("mouseout", function(){
			tooltip.transition().duration(200)
				.style("opacity", 0);
		});
		
	//Set up the small tooltip for when you hover over a circle
	var tooltip = g.append("text")
		.attr("class", "tooltip")
		.style("opacity", 0);
	
	/////////////////////////////////////////////////////////
	/////////////////// Helper Function /////////////////////
	/////////////////////////////////////////////////////////

	//Taken from http://bl.ocks.org/mbostock/7555321
	//Wraps SVG text	
	function wrap(text, width) {
	  text.each(function() {
		var text = d3.select(this),
			words = text.text().split(/\s+/).reverse(),
			word,
			line = [],
			lineNumber = 0,
			lineHeight = 1.4, // ems
			y = text.attr("y"),
			x = text.attr("x"),
			dy = parseFloat(text.attr("dy")),
			tspan = text.text(null).append("tspan").attr("x", x).attr("y", y).attr("dy", dy + "em");
			
		while (word = words.pop()) {
		  line.push(word);
		  tspan.text(line.join(" "));
		  if (tspan.node().getComputedTextLength() > width) {
			line.pop();
			tspan.text(line.join(" "));
			line = [word];
			tspan = text.append("tspan").attr("x", x).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
		  }
		}
	  });
	}//wrap	
	
}//RadarChart

var myApp = angular.module('serenata-de-amor-visualization', ['ui.router']);

myApp.config(function($stateProvider, $urlRouterProvider, $locationProvider) {
  
  $urlRouterProvider.otherwise("/");
  
  $locationProvider.html5Mode({
    enabled: false,
    requireBase: false,
    rewriteLinks: false
  });
  
  $stateProvider
    .state('total', {
      url: "/total",
      templateUrl: "partials/total.html"
    })  
    .state('view1', {
      url: "/view1",
      templateUrl: "partials/view1.html"
    })  
    .state('view2', {
      url: "/view2",
      templateUrl: "partials/view2.html"
    })  
    .state('view3', {
      url: "/view3",
      templateUrl: "partials/view3.html"
    })  
    .state('party', {
      url: "/party",
      templateUrl: "partials/party.html"
    })  
    .state('about', {
      url: "/",
      templateUrl: "partials/about.html"
    })  
});


d3 = d3version4;

d3.queue()
.defer(d3.csv, '/data/parties.csv')
.defer(d3.csv, '/data/byparty.csv')
.await(init);

function init (error, parties, byparty){
  d3 = d3version4;
  var parseTime = d3.timeParse("%Y-%m");
  d3 = d3version3;

  party = parties;
  data = byparty;
  parties = [];
  for (var i = 0; i < party.length; i++){
    var obj = {
      values: [], 
      key: party[i].party,
      color: getRandomColor()
    };
    parties.push(obj)
  }
  
  for (var i = 0; i < parties.length; i++){
    values = [];
    for (var j = 0; j < data.length; j++) {
      if (parties[i].key == data[j].party) {
        values.push({x: parseTime(data[j].year + "-" + data[j].month), y: parseInt(parseFloat(data[j].x1))})
      }
    }
    parties[i].values = values;
  }
  
  nv.addGraph(function() {
    chart = nv.models.lineChart()
    .options({
      duration: 300,
      useInteractiveGuideline: true
    })
    ;
    // chart sub-models (ie. xAxis, yAxis, etc) when accessed directly, return themselves, not the parent chart, so need to chain separately
    chart.xAxis
    .axisLabel("Date - Year-Month")
    .tickFormat(function(d) { return d3.time.format('%Y-%m')(new Date(d)); })
    .staggerLabels(true)
    ;
    chart.yAxis
    .axisLabel('Value - R$')
    .tickFormat(function(d) {
      if (d == null) {
        return 'N/A';
      }
      return d3.format(',.2f')(d);
    });
    
    data = parties;
    
    
    d3.select('#party-svg')
    .datum(data)
    .call(chart);
    nv.utils.windowResize(chart.update);
    return chart;
  });
}

function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++ ) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}



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

$(document).ready(function() {
  $('select').material_select();
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
      d.percent = +d.percent;
      return d;
    }
  }, function(error, data) {
    if (error) throw error;
    x.domain(data.map(function(d) { return d.state; }));
    y.domain([0, Math.max.apply(Math, stateData.map(function(d) { 
      return d.percent; 
    }))]);
    
    
    g.append("g")
    .attr("class", "axis axis--x")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));
    
    g.append("g")
    .attr("class", "axis axis--y")
    .call(d3.axisLeft(y).ticks(10, "%"))
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
    .attr("y", function(d) { return y(d.percent); })
    .attr("width", x.bandwidth())
    .attr("height", function(d) { return height - y(d.percent); })
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
  return 'Média - R$: ' + parseFloat(d.mean).toFixed(0) + 
  ' Máximo - R$: ' + (d.mean / d.percent).toFixed(0) + 
  ' Total - R$: ' + parseFloat(d.x1).toFixed(0) + 
  ' Deputados ('+ d.state+"): "+ d.people;
}

function update_state_vis(month, year) {
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
  
  y.domain([0, Math.max.apply(Math, stateData.map(function(d) { return d.percent; }))]);
  // THIS IS THE ACTUAL WORK!
  
  var bars = svg.selectAll(".bar")
  .attr("stroke-width", 4)
  .transition()
  .duration(300)
  .attr("height", function(d) {
    for (var i = 0; i < data.length; i++) {
      if (data[i].state == d.state) {
        return height - y(data[i].percent);
      }
    }
  })
  .attr("transform", function(d) {
    for (var i = 0; i < data.length; i++) {
      if (data[i].state == d.state) {
        return "translate(" + [0, (-this.y.baseVal.value + y(data[i].percent))] + ")"
      }
    }
  })
}



$("#select-state-year").on('change', function(){
  var year = $("#select-state-year").val();
  var month = $("#select-state-month").val();
  update_state_vis(month, year);
});

$("#select-state-month").on('change', function(){
  var year = $("#select-state-year").val();
  var month = $("#select-state-month").val();
  update_state_vis(month, year);
});

$(document).ready(function() {
  $('select').material_select();
});

var globalData;
var globalOptions;
var globalChart;
var newArr;

d3.csv("/data/bycompany.csv", function(data) {
  $(function () {
    globalData = data;
    normalizedData = createData(data,2016);
    var options = {
      
      chart: {
        type: 'heatmap',
        marginTop: 40,
        marginBottom: 80,
        plotBorderWidth: 1,
        renderTo: 'container'
      },
      
      title: {
        text: ''
      },
      
      xAxis: {
        categories: ['', '', '', '', '', '', '', '', '', '']
      },
      
      yAxis: {
        categories: ['', '', '', '', '', '', '', '', '', ''],
        title: null
      },
      
      colorAxis: {
        min: 0,
        minColor: '#e3f2fd',
        maxColor: '#2196f3'
      },
      
      legend: {
        align: 'right',
        layout: 'vertical',
        margin: 0,
        verticalAlign: 'top',
        y: 25,
        symbolHeight: 280
      },
      
      tooltip: {
        formatter: function () {
          return '<b> EMPRESA: <b>' + data[this.point.index].supplier + 
          '</b> <br><b>CNPJ/CPF: <b>' + data[this.point.index].cnpj_cpf + 
          '</b> <br><b>Valor: R$ <b>' + this.point.value.toFixed(0) + 
          '</b> <br><b>Posição (Anual): <b> ' + (this.series.data.length - this.point.index) + '</b>º<br>';
        }
      },
      series: [{
        name: 'Valor por empresa',
        borderWidth: 1,
        borderColor: '#FFFFFF',
        data: normalizedData,
        dataLabels: {
          enabled: true,
          color: '#000000'
        }
      }]
      
    };
    
    globalOptions = options;
    var chart = new Highcharts.Chart(options);
    globalChart = chart;
    
  });
});

function createData(data,year) {
  newArr = [];
  index = 0;
  for (var i = 0; i < data.length; i++) {
    if (data[i].year == year) {
      subArr = [];
      subArr.push(parseInt(index / 10));
      subArr.push(index % 10);
      val = parseInt(parseFloat(data[i].x1));
      subArr.push(val);
      newArr.push(subArr);
      index++;
    }
  }
  return newArr;
}


$("#list").on('change', function(){
  var selVal = $("#list").val();
  
  newData = createData(globalData, selVal);
  globalOptions.series = [{
    name: 'Valor por empresa',
    borderWidth: 1,
    borderColor: '#FFFFFF',
    data: newData,
    dataLabels: {
      enabled: true,
      color: '#000000'
    }
  }]
  
  var chart = new Highcharts.Chart(globalOptions);    
});



var person_data;
var state_data;
////////////////////////////////////////////////////////////// 
//////////////////////// Set-Up ////////////////////////////// 
////////////////////////////////////////////////////////////// 
var margin = {top: 100, right: 100, bottom: 100, left: 100},
width = Math.min(700, window.innerWidth - 10) - margin.left - margin.right,
height = Math.min(width, window.innerHeight - margin.top - margin.bottom - 20);

////////////////////////////////////////////////////////////// 
//////////////////// Draw the Chart ////////////////////////// 
////////////////////////////////////////////////////////////// 

var color = d3.scale.ordinal()
.range(["#00A0B0"]);

var radarChartOptions = {
  w: width,
  h: height,
  margin: margin,
  maxValue: 0.5,
  levels: 5,
  roundStrokes: true,
  color: color
};

//Load the data and Call function to draw the Radar chart
d3.json("./data/bypersonandsubquota.json", function(error, data){
  person_data = data;

  d3.csv("./data/bypersonandstate.csv", function(error, data){
    state_data = data;
    states = (array_unique(data.map(function(d) { return d.state; })));
    createStateSelect(states);
  });

});



function array_unique(arr) {
  var result = [];
  for (var i = 0; i < arr.length; i++) {
    if (result.indexOf(arr[i]) == -1) {
      result.push(arr[i]);
    }
  }
  return result;
}

$("#statelist").on('change', function(){
  var selVal = $("#statelist").val();
  createPersonSelect(selVal);
});

$("#personlist").on('change', function(){
  var selVal = $("#personlist").val();
  newData = searchPerson(selVal);
  RadarChart(".radarChart", newData, radarChartOptions);
});

function searchPerson(name) {
  for (var i = 0; i < person_data.length; i++) {
    if (person_data[i][0].key == name) {
      return person_data[i];
    }
  }
}

function createStateSelect(states) {
  for (var i = 0; i < states.length; i++) {
    $("#statelist")
    .append('<option value="'+states[i]+'">'+states[i]+'</option>')
  }
  $('select').material_select();
  
  var selVal = $("#statelist").val();
  createPersonSelect(selVal);
}

function createPersonSelect(state) {
  $('#personlist').empty();

  for (var i = 0; i < state_data.length; i++) {
    if (state_data[i].state == state) {
      $('#personlist')
      .append('<option value="'+state_data[i].congressperson_name+'">'+state_data[i].congressperson_name+'</option>');
    }
  }
  
  $('select').material_select();

  var selVal = $("#personlist").val();
  newData = searchPerson(selVal);
  RadarChart(".radarChart", newData, radarChartOptions);

}

$(document).ready(function() {
  $('select').material_select();
});
