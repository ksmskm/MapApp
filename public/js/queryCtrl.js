var queryCtrl = angular.module('queryCtrl', [
  'geolocation',
  'gservice'
]);

queryCtrl.controller('queryCtrl', qcontroller);

function qcontroller($scope, $log, $http, $rootScope, geolocation, gservice) {
  $scope.formData = {};
  var queryBody = {};

  geolocation.getLocation().then(function(data) {
    coords = {
      lat: data.coords.latitude,
      long: data.coords.longitude
    };

    $scope.formData.longitude = parseFloat(coords.long).toFixed(3);
    $scope.formData.latitude = parseFloat(coords.lat).toFixed(3);
    
    gservice.refresh($scope.formData.latitude, $scope.formData.longitude);
  });

  $rootScope.$on('marker_moved', function() {
    $scope.$apply(function() {
      $scope.formData.latitude = parseFloat(gservice.currentLat).toFixed(3);
      $scope.formData.longitude = parseFloat(gservice.currentLong).toFixed(3);
    });
  });

  $scope.queryUsers = function() {
    queryBody = {
      longitude: parseFloat($scope.formData.longitude),
      latitude: parseFloat($scope.formData.latitude),
      distance: parseFloat($scope.formData.distance),
      male: $scope.formData.male,
      female: $scope.formData.female,
      other: $scope.formData.other,
      minAge: $scope.formData.minage,
      maxAge: $scope.formData.maxage,
      favlang: $scope.formData.favlang,
      reqVerified: $scope.formData.verified
    };

    $http.post('/query', queryBody).then(function(rsp) {
      gservice.refresh(queryBody.latitude, queryBody.longitude, rsp.data);
      $scope.queryCount = rsp.data.length;
    });
  };
}

