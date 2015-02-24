'use strict';

angular.module('flowsApp')
  .directive('dropAreaUpdate', function (dataService, $window, $sessionStorage) {

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
              url: dataService.urls.dropupdate,
              parallelUploads: 1,
              maxFiles: 1,
              headers: {
                'X-alfresco-ticket': $sessionStorage.ticket
              }
            };

            opts.success = function (file, response) {
              scope.updated = response.document;
              scope.documentId = response.document;
              scope.$apply();
              instance.removeAllFiles(true);
            };

            opts.error = function (file, error, xhr) {
              if (xhr.status === 401) {
                $window.location = '';
              } else {
                // gestione default dell'errore
                Dropzone.prototype.defaultOptions.error(file, error);
              }
            };

            instance = new Dropzone(element[0], opts);
          }


        });


      }
    };
  });
