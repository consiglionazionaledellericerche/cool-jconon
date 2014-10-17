'use strict';

angular.module('flowsApp')
  .controller('LoginCtrl', function ($scope, $http, $location) {

    $scope.username = 'spaclient';
    $scope.password = 'sp@si@n0';

    $scope.login = function (username, password) {

      $http({
        method: 'POST',
        url: '/cool-flows/rest/security/login',
        data: {
          username: username,
          password: password
        }
      }).success(function (data) {
        $location.path('/main');
      }).error(function (data) {
        $scope.error = data;
      });


    };
  });
