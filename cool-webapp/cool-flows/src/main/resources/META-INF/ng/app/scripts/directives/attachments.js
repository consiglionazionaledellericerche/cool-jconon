'use strict';

angular.module('flowsApp')
  .directive('attachments', function () {

    return {
      restrict: 'E',
      scope: {
        main: '=',
        aux: '=',
        uploadContent: '=',
        updated: '='
      },
      templateUrl: 'views/attachments.html'
    };
  });