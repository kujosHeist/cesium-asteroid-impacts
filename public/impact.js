
var viewer = new Cesium.Viewer('cesiumContainer');
var impact_explosions = [];

 $(window).on("load", function(){

 	// loops through each asteroid datapoint and draws an impact 
 	// every 4 seconds (impacts defined in data.js)
	for(var i = 0; i < impacts.length; i++){
		var delay = i * 4000;
		
		var impact_tokens = impacts[i].split(",");
		call_timeout_with_delay(impact_tokens, delay);
	}
 });

function call_timeout_with_delay(impact_tokens, delay){
  	setTimeout(function(){
		draw_impact(impact_tokens);
  	}, delay);  
}

var impact_label = null;

function draw_impact(impact_tokens){

	// removes explosion from previous impact
	for(var i = 0; i < impact_explosions.length; i++){
		viewer.entities.remove(impact_explosions[i]);
	}
	
	if(impact_label != null){
		viewer.entities.remove(impact_label);
	}

	date = impact_tokens[0];
	longitude = parseFloat(impact_tokens[1]);
	latitude = parseFloat(impact_tokens[2]);


	// adds point to base of impact line
	viewer.entities.add({
		name: 'impact date: ' + date,
		position : Cesium.Cartesian3.fromDegrees(longitude, latitude, 1000),
		point : {
			pixelSize : 3,
			color : Cesium.Color.YELLOW
		}        
	}); 

	// adds label to impact line
	impact_label = viewer.entities.add({
		name: 'Impact Year: ' + date,

		label : {
			text : '   Impact Year: ' + date,
			horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
			fillColor: Cesium.Color.YELLOW,
			font: '17px sans-serif'
		},     
		position : Cesium.Cartesian3.fromDegrees(longitude, latitude, 1000000),
		point : {
			pixelSize : 4,
			color : Cesium.Color.RED
		}        
	});    

	// adds point to top of impact line
	viewer.entities.add({
		name: 'impact date: ' + date,     
		position : Cesium.Cartesian3.fromDegrees(longitude, latitude, 1000000),
		point : {
			pixelSize : 4,
			color : Cesium.Color.RED
		}        
	});  

	// adds impact line, which is an arrow point to the point of impact 
	viewer.entities.add({
		name : 'Impact',
		polyline : {
			positions : Cesium.Cartesian3.fromDegreesArrayHeights([longitude, latitude, 1000000,
												   longitude, latitude, 1000]),
			width : 8,
			followSurface : false,
			material : new Cesium.PolylineArrowMaterialProperty(Cesium.Color.GREEN)
		}
	}); 

	var size_array_length = [200000.0, 400000.0, 500000.0]
	var size_array_bottom = [100000.0, 200000.0, 350000.0]

	// calls function to draw expanding set of red cones around impact point to simulate explosion
	for(var j = 0; j < size_array_bottom.length; j++){
		var delay = j * 700;
		make_crater_with_delay(longitude, latitude, size_array_length[j], size_array_bottom[j], delay)
	}

	// move camera to view impact
	viewer.flyTo(impact_label, {offset:  new Cesium.HeadingPitchRange(0.0, Cesium.Math.toRadians(-60.0), 10000 * 1000)})
}   


function make_crater_with_delay(longitude, latitude, length, bottom, delay){
	setTimeout(function(){
		draw_crater(longitude, latitude, length, bottom);
	}, delay);
}

// draws red cone around impact point
function draw_crater(longitude, latitude, length, bottom){
	var redCone = viewer.entities.add({
		name : 'Red cone',
		position: Cesium.Cartesian3.fromDegrees(longitude, latitude, bottom),

		cylinder : {
		length : length,
		topRadius : 0.0,
		bottomRadius : bottom,
		material : Cesium.Color.RED.withAlpha(0.5)
		},
	});

	// keeps track of red cones to remove when next impact is displayed
	impact_explosions.push(redCone)
}