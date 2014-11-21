'use strict';

angular.module('flowsApp')
  .directive('dropArea', function (dataService) {

    return {
      restrict: 'AE',
      scope: false,
      link: function link(scope, element, attrs) {

        var opts = {
          url: dataService.urls.drop,
          parallelUploads: 1
        };


        if (attrs.documentId) {
          // override
          console.log('override', attrs.documentId);

          opts.success = function (file, response) {
            console.log(file, response);
          };

          opts.maxFiles = 1;

          opts.params = {
            'document-id': attrs.documentId
          };

        } else {
          // add file to folder
          opts.success = function (file, response) {
            var folder = response.folder;
            scope.folder = folder;
            console.log(response.document.split(';')[0]);
          };

          opts.params = {
            username: localStorage.getItem('username'),
            id: scope.tempId,
            type: attrs.documentType
          };

        }

        new Dropzone(element[0], opts);

      }
    };
  });
