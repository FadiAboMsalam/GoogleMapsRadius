"use strict";

var Map = function(arrayOfFakeLatLng) {
	this.arrayOfFakeLatLng = arrayOfFakeLatLng;
	this.arrayOfMarkers = [];
	this.currentMarker;
	this.map;
	this.radiusFromRangeSlider = 20000; //default value of radius
}
Map.prototype.initMap = function(centerLatLng, zoomLevel) {
	var map = new google.maps.Map(document.getElementById('map'), {
		center: centerLatLng,
		zoom: zoomLevel
	});
	this.map = map;
	return map;
};
Map.prototype.setMarker = function(latLngObj, map, titleOfMarker) {
	var marker = new google.maps.Marker({
		position: latLngObj,
		map: map,
		title: titleOfMarker
	});
	marker.setAnimation(null);
	var obj = this;
	google.maps.event.addListener(marker, 'click', function() {
		obj.markerClicked(marker, map, obj.radiusFromRangeSlider);
		obj.currentMarker = marker;
		obj.animateMarker(marker);
	});
	this.arrayOfMarkers.push(marker);
};
Map.prototype.animateMarker = function(marker) {
	if (marker.getAnimation() !== null) {
		marker.setAnimation(null);
	} else {
		marker.setAnimation(google.maps.Animation.BOUNCE);
	}
};
Map.prototype.markerClicked = function(marker, map, radius) {

	this.drawCircle(map, marker.position, radius);
	//calc distance inside radius and remove outside markers
	this.HideMarkersOutsideRadius(this.arrayOfMarkers, radius, marker.position);
	this.buttonClickedFromMarker(marker);
};
Map.prototype.hideMarker = function(marker) {
	// marker.setMap(null);
	marker.setVisible(false);
};
Map.prototype.showMarker = function() {
	for (var i = 0, length = this.arrayOfMarkers.length; i < length; i++) {
		var markerDist = google.maps.geometry.spherical.computeDistanceBetween(this.arrayOfMarkers[i].position, this.getCurrentMarker().position);
		if (markerDist < this.radiusFromRangeSlider)
			this.arrayOfMarkers[i].setVisible(true);
	}
};
Map.prototype.getCurrentMarker = function() {
	return this.currentMarker;
};
Map.prototype.getArrayOfMarkers = function() {
	return this.arrayOfMarkers;
};
Map.prototype.drawCircle = function(map, center, raduis) {
	//draw circle from polygon
	var circlePoints = generateGeoJSONCircle(center, raduis, 360);
	//which put dark layer outside circle
	var dark_layer = [
		[0, 90],
		[180, 90],
		[180, -90],
		[0, -90],
		[-180, -90],
		[-180, 0],
		[-180, 90],
		[0, 90]
	];

	var geojson = {
		"type": "FeatureCollection",
		"features": [{
			"type": "Feature",
			"geometry": {
				"type": "Polygon",
				"coordinates": [
					dark_layer,
					circlePoints
				]
			},
			"properties": {}
		}]
	};
	//loop to remove old geoJson Layers
	map.data.forEach(function(feature) {
		map.data.remove(feature);
	});

	//add new GeoJson Layer
	map.data.addGeoJson(geojson);

};

function generateGeoJSONCircle(center, radius, numSides) {

	var points = [],
		degreeStep = 360 / numSides;

	for (var i = 0; i < numSides; i++) {
		var gpos = google.maps.geometry.spherical.computeOffset(center, radius, degreeStep * i);
		points.push([gpos.lng(), gpos.lat()]);
	};

	// Duplicate the last point to close the geojson ring
	points.push(points[0]);

	return points;
}

// obj.map.setZoom(8 + (slider.value - slider.defaultValue) / slider.step);
// obj.map.panTo(obj.getCurrentMarker().position);

Map.prototype.sliderRedrawCircle = function(slider) {
	var obj = this; //input while sliding
	google.maps.event.addDomListener(slider, 'click', function() {
		var sliderValue = parseInt(slider.value);
		obj.radiusFromRangeSlider = sliderValue;
		obj.markerClicked(obj.getCurrentMarker(), obj.map, sliderValue);
		obj.showMarker();
	});

};
Map.prototype.addView = function(position, obj) {
	this.map.controls[position].push(obj);
};
Map.prototype.HideMarkersOutsideRadius = function(arrayOfMarkers, raduis, centerOfCircle) {
	for (var i = 0, length = arrayOfMarkers.length; i < length; i++) {
		var dist = google.maps.geometry.spherical.computeDistanceBetween(centerOfCircle, arrayOfMarkers[i].position);
		if (dist > raduis) {
			this.hideMarker(arrayOfMarkers[i])
		}
	}
};
Map.prototype.buttonClickedFromMarker = function(marker) {
	for (var i = 0, length = this.arrayOfFakeLatLng.length; i < length; i++) {
		if (marker.getPosition().lat().toFixed(2) === this.arrayOfFakeLatLng[i]["place"]["lat"].toFixed(2) && marker.getPosition().lng().toFixed(2) === this.arrayOfFakeLatLng[i]["place"]["lng"].toFixed(2)) {
			var s = document.getElementById(this.arrayOfFakeLatLng[i]["name"].toString());
			s.style.background = '#ADD8E6'
		}
	}
};