'use strict';

angular.module('flowsApp')
  .controller('MainCtrl', function ($scope, $http, $location) {

    $http.get('/cool-flows/rest/common').success(function (data) {
      $scope.common = data.User;
    });

    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
