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
        minColor: '#d6fafe',
        maxColor: '#00a0b0'
      },

      legend: {
        align: 'right',
        layout: 'vertical',
        margin: 0,
        verticalAlign: 'top',
        y: 30,
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
        borderColor: '#d0e0e2',
        data: normalizedData,
        dataLabels: {
          enabled: true,
          color: '#06515a'
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
