var addCtrl = angular.module('addCtrl', ['geolocation', 'gservice']);

addCtrl.controller('addCtrl', acontroller);

function acontroller($scope, $http, $rootScope, geolocation, gservice) {
  $scope.formData = {
    latitude: gservice.currentLat,
    longitude: gservice.currentLong
  };
  
  if ($scope.formData.latitude === undefined) {
    geolocation.getLocation().then(function(position) {
      $scope.formData = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      };
    });
  }

  $rootScope.$on('marker_moved', function() {
    $scope.$apply(function() {
      $scope.formData.latitude = gservice.currentLat;
      $scope.formData.longitude = gservice.currentLong;
    });
  });  

  $scope.createUser = function() {
    var userData = {
      username: $scope.formData.username,
      gender: $scope.formData.gender,
      age: $scope.formData.age,
      favlang: $scope.formData.favlang,
      location: [$scope.formData.longitude, $scope.formData.latitude],
      htmlverified: $scope.formData.htmlverified
    };

    $http.post('/users', userData).then(function (rsp) {
      $scope.formData.username = "";
      $scope.formData.gender = "";
      $scope.formData.age = "";
      $scope.formData.favlang = "";
      gservice.refresh($scope.formData.latitude, $scope.formData.longitude);
    });
  };
}
