(function () {

  'use strict';

  var opts = {
    series: {
      pie: {
        show: true,
        innerRadius: 0.3
      }
    },
    legend: {
      show: false
    }
  };

  angular
    .module('metaInfApp')
    .directive('pieChart', function () {
      return {
        template: '<div class="pie"></div>',
        restrict: 'E',
        require: 'ngModel',
        link: function (scope, element, attributes, ngModel) {

          var target = element.children()[0];

          scope.$watch(function () {
            return ngModel.$modelValue;
          }, function (newValue) {
            if (newValue) {

              var data = [
                {
                  label: 'completati',
                  data: newValue[true],
                  color: '#00CC00'
                },
                {
                  label: 'in corso',
                  data: newValue[false],
                  color: '#CC0000'
                }
              ];

              $.plot(target, data, opts);

            }
          });

        }
      };
    });

}());
