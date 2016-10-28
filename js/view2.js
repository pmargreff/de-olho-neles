
d3.csv("/data/bycompany2015.csv", function(data) {
 $(function () {
   normalizedData = createData(data);
   $('#container').highcharts({
     
     chart: {
       type: 'heatmap',
       marginTop: 40,
       marginBottom: 80,
       plotBorderWidth: 1
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
       minColor: '#ffcdd2',
       maxColor: '#b71c1c'
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
         console.log();
         return '<b> Company: <b>' + data[this.point.index].supplier + 
         '</b> <br><b>CNPJ/CPF: <b>' + data[this.point.index].cnpj_cpf + 
         '</b> <br><b>Value: R$ <b>' + this.point.value.toFixed(0) + 
         '</b> <br><b>Position: <b> ' + (100 - this.point.index) + '</b>º<br>';
       }
     },
     series: [{
       name: 'Value per company',
       borderWidth: 1,
       borderColor: '#FFFFFF',
       data: normalizedData,
       dataLabels: {
         enabled: true,
         color: '#000000'
       }
     }]
     
   });
 });
});

function createData(data) {
 newArr = [];
 for (var i = 0; i < 100; i++) {
   subArr = [];
   subArr.push(parseInt(i / 10));
   subArr.push(i % 10);
   val = parseInt(parseFloat(data[i].value));
   subArr.push(val);
   newArr.push(subArr);
 }
 
 return newArr;
}
