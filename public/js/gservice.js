angular.module('gservice', []).factory('gservice', function($rootScope, $http, geolocation) {
  var googleMapService = {};
  var locations = [];
  var locationMarkers = [];
  var currentLat = 39.50;
  var currentLong = -98.35;
  var map;
  geolocation.getLocation().then(function(data) {
    var latitude = parseFloat(data.coords.latitude).toFixed(3);
    var longitude = parseFloat(data.coords.longitude).toFixed(3);
    var map = new google.maps.Map(document.getElementById('map'), {
      zoom: 3,
      center: new google.maps.LatLng(latitude, longitude)
    });
    gservice.refresh(latitude, longitude);    
  }, function() {
    var map = new google.maps.Map(document.getElementById('map'), {
      zoom: 3,
      center: new google.maps.LatLng(currentLat, currentLong)
    });
    gservice.refresh(currentLat, currentLong);
  });

  googleMapService.clear = function() {
    locationMarkers.forEach(function(n) {
      n.setMap(null);
    });
    locationMarkers = [];
  }; 

  googleMapService.refresh = function(latitude, longitude, filteredResults) { 
    var locationMarkers = [];
    if (filteredResults) {
      locations = convertToMapPoints(filteredResults);
      initialize(latitude, longitude, true);
    } else {
      $http.get('/users').then(function(rsp) {
        locations = convertToMapPoints(rsp.data);
        initialize(latitude, longitude, false);
      });
    }
  };

  var initialize = function(latitude, longitude, filter) {

    var map = new google.maps.Map(document.getElementById('map'), {
      zoom: 3,
      center: new google.maps.LatLng(latitude, longitude)
    });

    locations.forEach(function(n) {
      var marker = new google.maps.Marker({
        position: n.latlon,
        map: map,
        icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
      });
      locationMarkers.push(marker);
      google.maps.event.addListener(marker, 'click', function(e) {
        currentSelectedMarker = n;
        n.message.open(map, marker);
      });
    });

    var marker = new google.maps.Marker({
      position: new google.maps.LatLng(latitude, longitude),
      map: map,
      icon: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
    });
    lastMarker = marker;

    map.panTo(new google.maps.LatLng(latitude, longitude));

    google.maps.event.addListener(map, 'click', onClickMap);
    google.maps.event.addListener(map, 'drag', onDragMap);    
    function onDragMap(e) {
      var marker;
      if (lastMarker) {
        marker = lastMarker; 
      } else {
        marker = new google.maps.Marker({
          position: map.getCenter(),
          map: map,
          icon: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
        });
      }

      marker.setPosition(map.getCenter());
      lastMarker = marker;

      googleMapService.currentLat = marker.getPosition().lat();
      googleMapService.currentLong = marker.getPosition().lng();
      $rootScope.$broadcast("marker_moved");
    }
    function onClickMap(e) {
      var marker = new google.maps.Marker({
        position: e.latLng,
        map: map,
        icon: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
      });

      if (lastMarker) {
        lastMarker.setMap(null);
      }

      lastMarker = marker;
      map.panTo(marker.position);

      googleMapService.currentLat = marker.getPosition().lat();
      googleMapService.currentLong = marker.getPosition().lng();
      $rootScope.$broadcast("marker_moved");
    }
  };
  return googleMapService;
});

function convertToMapPoints(response) {
  var locations = [];

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
