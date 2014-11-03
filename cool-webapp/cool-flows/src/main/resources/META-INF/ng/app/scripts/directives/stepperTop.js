'use strict';

angular.module('flowsApp')
  .directive('stepperTop', function () {

    return {
      restrict: 'E',
      scope: {
        step: '=',
        steps: '='
      },
      templateUrl: 'views/stepperTop.html'
    };
  });