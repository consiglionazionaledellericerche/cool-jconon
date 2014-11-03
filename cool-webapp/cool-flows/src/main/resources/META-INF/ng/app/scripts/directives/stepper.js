'use strict';

angular.module('flowsApp')
  .directive('stepper', function () {

    return {
      restrict: 'E',
      scope: {
        hideStepper: '=',
        changeStep: '=',
        step: '=',
        steps: '='
      },
      templateUrl: 'views/stepper.html'
    };
  });