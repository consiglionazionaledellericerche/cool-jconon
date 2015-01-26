'use strict';

angular.module('flowsApp')
  .directive('attachmentsType', function (dataService, $log) {

    return {
      restrict: 'E',
      scope: {
        documents: '=',
        uploadContent: '=',
        updated: '='
      },
      templateUrl: 'views/attachments-type.html',
      link: function (scope) {
        scope.urlContent = dataService.urls.content;

        scope.innerUploadContent = function (val) {
          $log.debug('inner');
          scope.uploadContent();
          scope.fileToUpdate = val;
        };

        scope.displayMetadata = function (d) {
          scope.document = d;
        };

      }
    };
  });