'use strict';

angular.module('flowsApp')
  .directive('dropArea', function () {

    return {
      restrict: 'AE',
      scope: false,
      link: function link(scope, element, attrs) {

        new Dropzone(element[0], {
          url: '/cool-flows/rest/drop',
          params: {
            username: localStorage.getItem('username'),
            id: scope.tempId,
            type: attrs.documentType
          },
          success: function (file, response) {
            var folder = response.folder;
            scope.folder = folder;
            console.log(response.document.split(';')[0]);
          }
        });

      }
    };
  });