angular.module('gservice', []).factory('gservice', function($rootScope, $http, geolocation) {
  var googleMapService = {};
  var locations = [];
  var locationMarkers = [];  
  var currentLat = 39.50;
  var currentLong = -98.35;
  var currentMarker = null;
  var map;

  geolocation.getLocation().then(function(data) {
    currentLat = parseFloat(data.coords.latitude).toFixed(3);
    currentLong = parseFloat(data.coords.longitude).toFixed(3);
    map = new google.maps.Map(document.getElementById('map'), {
      zoom: 3,
      center: new google.maps.LatLng(currentLat, currentLong)
    });
    $http.get('/users').then(function(rsp) {
      locations = convertToMapPoints(rsp.data);
      initialize(currentLat, currentLong);    
    });
  });

  googleMapService.refresh = function(latitude, longitude, filteredResults) { 
    clearMarkers();
    if (filteredResults) {
      locations = convertToMapPoints(filteredResults);
      initialize(latitude, longitude);
    } else {
      $http.get('/users').then(function(rsp) {
        locations = convertToMapPoints(rsp.data);
        initialize(latitude, longitude);
      });
    }
  };

  var clearMarkers = function() {
    locationMarkers.forEach(function(n) {
      n.setMap(null);
    });
    locationMarkers = [];
    locations = [];
  }
  
  var convertToMapPoints = function(response) {
    locations = [];
    for (var i = 0; i < response.length; i++) {
      var user = response[i];
      var contentString =
        '<p><b>Username</b>: ' + user.username +
        '<br><b>Age</b>: ' + user.age +
        '<br><b>Gender</b>: ' + user.gender +
        '<br><b>Favorite Language</b>: ' + user.favlang +
        '</p>';

      locations.push({
        latlon: new google.maps.LatLng(user.location[1], user.location[0]),
        message: new google.maps.InfoWindow({
          content: contentString,
          maxWidth: 320
        }),
        username: user.username,
        gender: user.gender,
        age: user.age,
        favlang: user.favlang
      });
    }
    return locations;
  };

  var initialize = function(latitude, longitude) {
    locations.forEach(function(n) {
      var marker = new google.maps.Marker({
        position: n.latlon,
        map: map,
        icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
      });
      google.maps.event.addListener(marker, 'click', function(e) {
        n.message.open(map, marker);
      });
      locationMarkers.push(marker);
    });
    if (currentMarker) currentMarker.setMap(null);
    currentMarker = new google.maps.Marker({
      position: new google.maps.LatLng(latitude, longitude),
      map: map,
      icon: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
    });

    map.panTo(new google.maps.LatLng(latitude, longitude));

    google.maps.event.addListener(map, 'click', function(e) {
      currentMarker.setPosition(e.latLng);
      map.panTo(currentMarker.position);
      googleMapService.currentLat = currentMarker.getPosition().lat();
      googleMapService.currentLong = currentMarker.getPosition().lng();
      $rootScope.$broadcast("marker_moved");
    });
    google.maps.event.addListener(map, 'drag', function(e) {
      currentMarker.setPosition(map.getCenter());
      googleMapService.currentLat = currentMarker.getPosition().lat();
      googleMapService.currentLong = currentMarker.getPosition().lng();
      $rootScope.$broadcast("marker_moved");
    });    
  };
  return googleMapService;
});
