'use strict';

angular.module('flowsApp')
  .controller('NavbarCtrl', function ($scope, $location, $routeParams, $sessionStorage, $rootScope, logoutService, $log, dataService) {

    var path = $location.path();

    $log.debug(path);

    if ($sessionStorage.user) {
      $rootScope.user = $sessionStorage.user;
    } else {
      if ($location.path().indexOf('login') < 0) {
        logoutService.logout();
      }
    }

    $scope.logout = function () {

      dataService.security.logout().finally(function () {
        logoutService.logout();
      });

    };

    $scope.search = function (query) {
      $location.path('/search/' + query); //
    };


  });
