
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
