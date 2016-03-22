var app = angular.module('meanMapApp', [
  'addCtrl',
  'queryCtrl',
  'extraCtrl',
  'geolocation', 
  'gservice',
  'ngRoute'
]);

app.config(function($routeProvider, $locationProvider) {
  $routeProvider
    .when('/join', {
      controller: 'addCtrl',
      templateUrl: 'partials/addForm.html',
    })
    .when('/find', {
      controller: 'queryCtrl',
      templateUrl: 'partials/queryForm.html'
    })
    .otherwise({redirectTo: '/join'});

    // to remove /# from URLs
    $locationProvider.html5Mode(true);
});
