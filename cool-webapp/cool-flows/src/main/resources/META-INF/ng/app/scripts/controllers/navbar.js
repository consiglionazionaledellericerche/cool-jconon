'use strict';

angular.module('flowsApp')
  .controller('NavbarCtrl', function ($scope, $location, $routeParams, $sessionStorage, $rootScope) {

    var path = $location.path();

    console.log(path);

    function redirectLogin() {
      $location.path('/login');
    }

    if ($sessionStorage.user) {
      $rootScope.user = $sessionStorage.user;
    } else {
      if ($location.path().indexOf('login') < 0) {
        redirectLogin();
      }
    }

    $scope.logout = function () {
      $sessionStorage.user = null;
      $rootScope.user = null;

      redirectLogin();
    };

    $scope.search = function (query) {
      $location.path('/search/' + query); //
    };


  });
