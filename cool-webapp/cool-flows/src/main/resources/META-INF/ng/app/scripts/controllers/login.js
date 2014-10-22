'use strict';

angular.module('flowsApp')
  .controller('LoginCtrl', function ($scope, $http, $location, $rootScope) {

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


        console.log(data);
        $http({
          url: '/cool-flows/rest/common',
          method: 'GET'
        }).success(function (data) {

          $rootScope.user = data.User;

          $location.path('/main');

        });


      }).error(function (data) {
        $scope.error = data;
      });


    };
  });
