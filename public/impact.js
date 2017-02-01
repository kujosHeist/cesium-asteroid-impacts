
var viewer = new Cesium.Viewer('cesiumContainer');
var craters = [];

 $(window).on("load", function(){

 	// loops through each asteroid datapoint and draws an impact 
 	// every 4 seconds (impacts defined in data.js)
	for(var i = 0; i < impacts.length; i++){
		var delay = i * 4000;
		var tokens = impacts[i].split(",");
		
		call_timeout(tokens, delay);
	}
 });

function call_timeout(tokens, delay){
  	setTimeout(function(){
		draw_impact(tokens);
  	}, delay);  
}

var point = null;

function draw_impact(tokens){
	
	for(var i = 0; i < craters.length; i++){
		viewer.entities.remove(craters[i]);
	}
	
	if(point != null){
		viewer.entities.remove(point);
	}

	date = tokens[0];
	longitude = parseFloat(tokens[1]);
	latitude = parseFloat(tokens[2]);

	viewer.entities.add({
		name: 'impact date: ' + date,
		position : Cesium.Cartesian3.fromDegrees(longitude, latitude, 1000),
		point : {
			pixelSize : 3,
			color : Cesium.Color.YELLOW
		}        
	}); 

	point = viewer.entities.add({
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

	viewer.entities.add({
		name: 'impact date: ' + date,     
		position : Cesium.Cartesian3.fromDegrees(longitude, latitude, 1000000),
		point : {
			pixelSize : 4,
			color : Cesium.Color.RED
		}        
	});  

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

	for(var j = 0; j < size_array_bottom.length; j++){
		var delay = j * 700;
		make_crater(longitude, latitude, size_array_length[j], size_array_bottom[j], delay)
	}

	viewer.flyTo(point, {offset:  new Cesium.HeadingPitchRange(0.0, Cesium.Math.toRadians(-60.0), 10000 * 1000)})
}   


function make_crater(longitude, latitude, length, bottom, delay){
	setTimeout(function(){
		draw_crater(longitude, latitude, length, bottom);
	}, delay);
}

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
	craters.push(redCone)
}