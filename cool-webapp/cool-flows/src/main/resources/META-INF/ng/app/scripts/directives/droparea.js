'use strict';

angular.module('flowsApp')
  .directive('dropArea', function (dataService, $sessionStorage) {

    return {
      restrict: 'AE',
      scope: false,
      link: function link(scope, element, attrs) {

        var opts = {
          url: dataService.urls.drop,
          parallelUploads: 1
        };

        // add file to folder
        opts.success = function (file, response) {
          var folder = response.folder;
          scope.folder = folder;
          console.log(response.document.split(';')[0]);
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
