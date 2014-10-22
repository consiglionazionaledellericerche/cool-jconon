'use strict';

angular.module('flowsApp')
  .controller('NavbarCtrl', function ($scope, $http, $location, $routeParams, $rootScope) {

    var path = $location.path();

    console.log(path);

    $scope.logout = function () {
      $rootScope.user = null;
      $location.path('/login');
    };

  });
