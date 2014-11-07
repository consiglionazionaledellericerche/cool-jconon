'use strict';

angular.module('flowsApp')
  .directive('attachmentsType', function (dataService) {

    return {
      restrict: 'E',
      scope: {
        documents: '='
      },
      templateUrl: 'views/attachments-type.html',
      link: function (scope) {
        scope.urlContent = dataService.urls.content;
      }
    };
  });