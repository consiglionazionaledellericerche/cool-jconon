'use strict';

angular.module('flowsApp')
  .directive('dropAreaUpdate', function (dataService) {

    return {
      restrict: 'AE',
      scope: {
        documentId: '@',
        updated: '='
      },
      link: function link(scope, element) {


        var instance;

        scope.$watch('documentId', function (val) {

          if (instance) {
            if (val) {
              instance.options.params['document-id'] = val;
            }
          } else {
            // init element

            var opts = {
              url: dataService.urls.drop,
              parallelUploads: 1,
              maxFiles: 1
            };

            opts.success = function (file, response) {
              scope.updated = response.document;
              scope.documentId = response.document;
              scope.$apply();
              instance.removeAllFiles(true);
            };

            instance = new Dropzone(element[0], opts);
          }


        });


      }
    };
  });
