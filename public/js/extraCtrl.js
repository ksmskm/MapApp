var extraCtrl = angular.module('extraCtrl', ['gservice', 'geolocation']);
extraCtrl.controller('extraCtrl', econtroller);

function econtroller($scope, gservice, geolocation) {
  $scope.refresh = function() {
    geolocation.getLocation().then(function(data) {
      coords = {
        lat: data.coords.latitude,
        long: data.coords.longitude
      };

      var longitude = parseFloat(coords.long).toFixed(3);
      var latitude = parseFloat(coords.lat).toFixed(3);
      
      gservice.refresh(latitude, longitude);
    });
  };
}
