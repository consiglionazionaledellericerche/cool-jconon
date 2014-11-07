'use strict';

angular.module('flowsApp')
  .controller('LoginCtrl', function ($scope, dataService, $location, $rootScope) {

    // $scope.username = 'spaclient';
    // $scope.password = 'sp@si@n0';

    $scope.login = function (username, password) {

      dataService.security.login(username, password).success(function (data) {

        console.log(data);
        dataService.common().success(function (data) {

          $rootScope.user = data.User;

          $location.path('/main');

        });


      }).error(function (data) {
        $scope.error = data;
      });


    };
  });
