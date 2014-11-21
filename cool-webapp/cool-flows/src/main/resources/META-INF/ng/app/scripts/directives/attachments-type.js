'use strict';

angular.module('flowsApp')
  .directive('attachmentsType', function (dataService) {

    return {
      restrict: 'E',
      scope: {
        documents: '=',
        uploadContent: '='
      },
      templateUrl: 'views/attachments-type.html',
      link: function (scope) {
        scope.urlContent = dataService.urls.content;

        scope.innerUploadContent = function (val) {
          console.log('inner');
          scope.uploadContent();
          scope.fileToUpdate = val;
        };
      }
    };
  });