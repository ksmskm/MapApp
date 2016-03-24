var queryCtrl = angular.module('queryCtrl', [
  'geolocation',
  'gservice'
]);

queryCtrl.controller('queryCtrl', qcontroller);

function qcontroller($scope, $log, $http, $rootScope, geolocation, gservice) {
  $scope.formData = {
    latitude: gservice.currentLat,
    longitude: gservice.currentLong
  };
  var queryBody = {};

  $rootScope.$on('marker_moved', function() {
    $scope.$apply(function() {
      $scope.formData.latitude = gservice.currentLat;
      $scope.formData.longitude = gservice.currentLong;
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
