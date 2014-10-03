'use strict';

angular.module('flowsApp')
  .controller('LoginCtrl', function ($scope, $http, $location) {
    $scope.login = function (username, password) {

      $http({
        method: 'POST',
        url: '/cool-flows/rest/security/login-json',
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
