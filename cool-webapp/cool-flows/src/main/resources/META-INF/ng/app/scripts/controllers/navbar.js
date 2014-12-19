'use strict';

angular.module('flowsApp')
  .controller('NavbarCtrl', function ($scope, $location, $routeParams, $sessionStorage, $rootScope, dataService) {

    var path = $location.path();
    $scope.urlContent = dataService.urls.content;

    console.log(path);

    if ($sessionStorage.user) {
      $rootScope.user = $sessionStorage.user;
    }

    $scope.logout = function () {
      $sessionStorage.user = null;
      $rootScope.user = null;

      $location.path('/login');
    };

    $scope.search = function (query) {
      $location.path('/search/' + query); //
    };

  });
