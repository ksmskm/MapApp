var addCtrl = angular.module('addCtrl', ['geolocation', 'gservice']);

addCtrl.controller('addCtrl', acontroller);

function acontroller($scope, $http, $rootScope, geolocation, gservice) {
  $scope.formData = {};
  var coords = {};
  var lat = 0;
  var long = 0;

  $rootScope.$on('marker_moved', function() {
    $scope.$apply(function() {
      $scope.formData.latitude = parseFloat(gservice.currentLat).toFixed(3);
      $scope.formData.longitude = parseFloat(gservice.currentLong).toFixed(3);
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
      gservice.refresh($scope.formData.latitude, formData.longitude);
    });
  };
}
