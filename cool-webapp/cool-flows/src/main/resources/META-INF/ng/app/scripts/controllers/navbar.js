'use strict';

angular.module('flowsApp')
  .controller('NavbarCtrl', function ($scope, $location, $routeParams, $rootScope) {

    var path = $location.path();

    console.log(path);

    $scope.logout = function () {
      $rootScope.user = null;
      $location.path('/login');
    };

  });
