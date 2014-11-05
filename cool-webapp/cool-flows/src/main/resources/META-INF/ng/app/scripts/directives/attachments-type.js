'use strict';

angular.module('flowsApp')
  .directive('attachmentsType', function () {

    return {
      restrict: 'E',
      scope: {
        documents: '='
      },
      templateUrl: 'views/attachments-type.html'
    };
  });