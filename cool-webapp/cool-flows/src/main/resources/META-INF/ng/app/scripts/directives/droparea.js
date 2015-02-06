'use strict';

angular.module('flowsApp')
  .directive('dropArea', function (dataService, $sessionStorage, $window, $log) {

    return {
      restrict: 'AE',
      scope: false,
      link: function link(scope, element, attrs) {

        var opts = {
          url: dataService.urls.drop,
          parallelUploads: 1,
          headers: {
            'X-alfresco-ticket': $sessionStorage.ticket
          }
        };

        // add file to folder
        opts.success = function (file, response) {
          var folder = response.folder;
          scope.folder = folder;
          $log.debug(response.document.split(';')[0]);
        };

        opts.error = function (file, error, xhr) {
          if (xhr.status === 401) {
            $window.location = '';
          }
        };

        opts.params = {
          username: $sessionStorage.user.id,
          id: scope.tempId,
          type: attrs.documentType
        };

        new Dropzone(element[0], opts);


      }
    };
  });
