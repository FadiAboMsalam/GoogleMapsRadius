"use strict";

var initializeMap = (function () {
	
	var myLatlng = {
		lat: 32.0,
		lng: 35.25
	};
	var zoom = 8;
	var arrayOfFakeLatLng=[{name:'Hotel 1',place:{lat:32.0,lng:35.25}},
	{name:'Hotel 2',place:{lat:32.0,lng:35.15}},
	{name:'Hotel 3',place:{lat:32.2,lng:35.30}},
	{name:'Hotel 4',place:{lat:32.5,lng:35.40}},
	{name:'Hotel 5',place:{lat:31.9,lng:35.25}},
	{name:'Hotel 6',place:{lat:31.0,lng:35.50}},
	{name:'Hotel 7',place:{lat:31.5,lng:35.60}},
	{name:'Hotel 8',place:{lat:32.8,lng:35.80}}];
	var arrayOfFakeLatLng2=[{name:'Hotel 9',place:{lat:33.0,lng:35.25}},
	{name:'Hotel 10',place:{lat:33.0,lng:35.15}},
	{name:'Hotel 11',place:{lat:33.2,lng:35.30}},
	{name:'Hotel 12',place:{lat:33.5,lng:35.40}},
	{name:'Hotel 13',place:{lat:34.9,lng:35.25}},
	{name:'Hotel 14',place:{lat:34.0,lng:35.50}},
	{name:'Hotel 15',place:{lat:34.5,lng:35.60}},
	{name:'Hotel 16',place:{lat:35.8,lng:35.80}}];
	var radius = 20000;
   
    return function () {
		//initialize map
		var map = new Map(arrayOfFakeLatLng);
		var mapObjReturned=map.initMap(myLatlng, zoom);
	 
		//draw markers on map
		for (var i = 0, length = arrayOfFakeLatLng.length; i < length; i++) {
			map.setMarker(arrayOfFakeLatLng[i]["place"], mapObjReturned, "titleOfMarker");
		}

		//draw radius slider
		var rangeSlider= new RangeSlider();
		rangeSlider.addViewToMap(map,arrayOfFakeLatLng,mapObjReturned);
    }
})();
initializeMap();