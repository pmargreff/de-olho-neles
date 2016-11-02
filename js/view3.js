
var width = 500,
    height = 500;

// Config for the Radar chart
var config = {
    w: width,
    h: height,
    maxValue: 100,
    levels: 10,
    ExtraWidthX: 300
}

create_data();


//Call function to draw the Radar chart
/*d3.json("data/data.json", function(error, data){
    if (error) throw error;
    
});*/


var svg = d3.select('body')
	.selectAll('svg')
	.append('svg')
	.attr("width", width)
	.attr("height", height);



function create_data(){
    d3.csv("data/bypersonandsubquota.csv", function(error, data){
        if (error) throw error;

        console.time("concatenation");

        var person_data = new Object();

        var set = new Set(data);

        var person = data.map(function(d) { return d.congressperson_name; });

        var description = data.map(function(d) { return d.subquota_description; });

        set = new Set(person);

        set_description = new Set(description);

        var aux = new Object();

        for(let item of set){
            person_data[item] = [];
            i = 0;
            for(let description_item of set_description){
                i++;
                person_data[description_item] = i-1;
                person_data[item].push(new Object({'area' : description_item, 'value' : 0}));
            }
            
        }

        for(i = 0; i < data.length; i++){
            person_data[data[i].congressperson_name][person_data[data[i].subquota_description]].value = data[i].value;
        }        

        RadarChart.draw("#chart", person_data['ABEL MESQUITA JR.'], config); 

        console.timeEnd("concatenation");

    });
}
