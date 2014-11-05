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
      templateUrl: function (el, attrs) {
        if (attrs.top) {
          return 'views/stepperTop.html';
        } else {
          return 'views/stepper.html';
        }
      }
    };
  });