$(document).ready(function() {
  $('select').material_select();
});

var  person_data;
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
d3.json("./data/teste.json", function(error, data){
  person_data = data;
  RadarChart(".radarChart", data[1], radarChartOptions);
});


$("#personlist").on('change', function(){
  var selVal = $("#personlist").val();
  newData = searchPerson(selVal);
  console.log(newData);
  RadarChart(".radarChart", newData, radarChartOptions);
  
});

function searchPerson(name) {
  for (var i = 0; i < person_data.length; i++) {
    if (person_data[i][0].key == name) {
      return person_data[i];
    }
  }
}
