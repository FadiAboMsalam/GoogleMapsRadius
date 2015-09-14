var RangeSlider = function() {

this.addViewToMap = function(map,arrayOfFakeLatLng,mapObjReturned) {
	
	var minMaxRadiuses=findMinMaxRadius(arrayOfFakeLatLng,mapObjReturned);
	var max=minMaxRadiuses[0];
	var min=minMaxRadiuses[1];

	var select=document.getElementById("select");
	var outerDiv=document.getElementById("outerDiv");
	outerDiv.style.margin='10px';
	var minValue=document.getElementById("minValue");
	var maxValue=document.getElementById("maxValue");
	minValue.innerHTML=min;
	maxValue.innerHTML=max.toFixed(2);
	minValue.style.margin='7px';
	maxValue.style.margin='7px';
	
	var slider=document.getElementById("slider");
	slider.min= min;
	slider.max=max;
	slider.step=(max-min)/arrayOfFakeLatLng.length;
	slider.value= (max-min)/2;


	var wrapperOfListDiv=document.getElementById("wrap");

	for(var i in arrayOfFakeLatLng){

		var option = document.createElement("option");
		option.text = arrayOfFakeLatLng[i].name;
		option.value = arrayOfFakeLatLng[i].place.lat+":"+arrayOfFakeLatLng[i].place.lng;
		select.appendChild(option);

		 var div = document.createElement('div');
		 div.className="list_item"

		 var btn = document.createElement('button');
		 btn.id=arrayOfFakeLatLng[i].name;
		 var t = document.createTextNode(arrayOfFakeLatLng[i].name);      
		 btn.appendChild(t);
		 btn.onclick = (function(i,btn){ 
		 	return function(){
		 		btn.style.background = '#ADD8E6'
		 		map.animateMarker(map.getArrayOfMarkers()[i]);
		 	}
		 })(i,btn);
		div.appendChild(btn);
		wrapperOfListDiv.appendChild(div);	
	}
	select.onchange = function(){
 	    mapObjReturned.setCenter(new google.maps.LatLng(select.value.split(":")[0],
 	    	select.value.split(":")[1]),8);
	};
	map.addView(google.maps.ControlPosition.TOP_LEFT,select);
	map.addView(google.maps.ControlPosition.TOP_LEFT,outerDiv);
	map.addView(google.maps.ControlPosition.TOP_LEFT,minValue);
	map.addView(google.maps.ControlPosition.TOP_LEFT,slider);
	map.addView(google.maps.ControlPosition.TOP_LEFT,maxValue);
	map.sliderRedrawCircle(slider);

};
}
function findMinMaxRadius(arrayOfFakeLatLng,mapObjReturned){
	var distancesFromPOI=[];
	var dist;
	var centerOfMap=mapObjReturned.getCenter();
	for(var i in arrayOfFakeLatLng){
		dist = google.maps.geometry.spherical.computeDistanceBetween(centerOfMap, new google.maps.LatLng(arrayOfFakeLatLng[i]["place"]["lat"],arrayOfFakeLatLng[i]["place"]["lng"]));
		distancesFromPOI.push(dist);
	}
	var max_of_dist = Math.max.apply(Math, distancesFromPOI)+1;//+1 to include farest point since it must be < mn max
	var min_of_dist = Math.min.apply(Math, distancesFromPOI);
	return [max_of_dist,min_of_dist];
}