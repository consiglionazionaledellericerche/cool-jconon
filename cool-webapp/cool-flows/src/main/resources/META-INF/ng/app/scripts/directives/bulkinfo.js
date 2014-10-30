'use strict';

angular.module('flowsApp')
  .directive('bulkinfo', function (dataService) {

    return {
      restrict: 'E',
      link: function link(scope, element, attrs) {
        console.log(scope, element, attrs);

        scope.$watch('definitionType', function (type) {

          dataService.bulkInfo(type).success(function (form) {
            scope.formElements = form['default'];
          });

        });
      },
      templateUrl: function(){
        return 'views/bulkinfo.html';
      }
    };

  });