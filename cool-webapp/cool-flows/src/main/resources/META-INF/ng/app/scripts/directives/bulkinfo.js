'use strict';

angular.module('flowsApp')
  .directive('bulkinfo', function (dataService) {

    return {
      restrict: 'E',
      scope: {
        definitionType: '=',
        data: '='
      },
      link: function link(scope) {

        scope.$watch('definitionType', function (type) {

          dataService.bulkInfo(type).success(function (form) {
            var formElements = form['default'];
            scope.formElements = formElements;
            scope.data = {
              get: function () {
                var data = {};

                _.each(formElements, function (item) {
                  data['prop_' + item.property.replace(':', '_')] = item['ng-value'];
                });

                return data;
              }
            };
          });

        });
      },
      templateUrl: 'views/bulkinfo.html'
    };

  });