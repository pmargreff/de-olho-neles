

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
  
  totalarray = newData[0].values;
  var total = 0;
  for (var i = 0; i < totalarray.length; i++) {
    total += totalarray[i].value;
  }
  
  $("#totalspentbydeputy").html(total.toFixed(0));
  
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
  
  totalarray = newData[0].values;
  var total = 0;
  for (var i = 0; i < totalarray.length; i++) {
    total += totalarray[i].value;
  }
  
  $("#totalspentbydeputy").html(total.toFixed(0));
  
  RadarChart(".radarChart", newData, radarChartOptions);
}

function chunk(str, n) {
  var ret = [];
  var i;
  var len;
  
  for(i = 0, len = str.length; i < len; i += n) {
    ret.push(str.substr(i, n))
  }
  
  return ret
};

$(document).ready(function() {
  $('select').material_select();
});
