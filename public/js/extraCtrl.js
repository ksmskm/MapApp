var extraCtrl = angular.module('extraCtrl', ['gservice', 'geolocation']);
extraCtrl.controller('extraCtrl', econtroller);

function econtroller($scope, gservice, geolocation) {
  $scope.refresh = function() {
    geolocation.getLocation().then(function(data) {
      var latitude = parseFloat(data.coords.latitude).toFixed(3);
      var longitude = parseFloat(data.coords.longitude).toFixed(3);
      gservice.refresh(latitude, longitude);
    });
  };
  
  $scope.clear = function() {
    gservice.clear();
  };

  $scope.refresh();
}
