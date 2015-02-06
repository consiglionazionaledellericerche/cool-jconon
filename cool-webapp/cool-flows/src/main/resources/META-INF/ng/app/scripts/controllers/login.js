'use strict';

angular.module('flowsApp')
  .controller('LoginCtrl', function ($scope, dataService, $location, $rootScope, $sessionStorage, $log) {

    $scope.username = 'spaclient';
    $scope.password = 'sp@si@n0';

    $scope.login = function (username, password) {

      dataService.security.login(username, password).success(function (data) {

        $sessionStorage.ticket = data.ticket;

        $log.debug(data);
        dataService.common().success(function (data) {

          var user = data.User;
          $rootScope.user = user;
          $sessionStorage.user = user;

          $location.path('/main');

        });


      }).error(function (data) {
        $scope.error = data;
      });


    };
  });
