'use strict';

angular.module('flowsApp')
  .controller('NavbarCtrl', function ($scope, $location, $routeParams, $sessionStorage, $rootScope, logoutService) {

    var path = $location.path();

    console.log(path);

    if ($sessionStorage.user) {
      $rootScope.user = $sessionStorage.user;
    } else {
      if ($location.path().indexOf('login') < 0) {
        logoutService.logout();
      }
    }

    $scope.logout = logoutService.logout;

    $scope.search = function (query) {
      $location.path('/search/' + query); //
    };


  });
