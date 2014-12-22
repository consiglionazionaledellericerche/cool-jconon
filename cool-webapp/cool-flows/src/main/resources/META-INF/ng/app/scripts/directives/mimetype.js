'use strict';

angular.module('flowsApp')
  .directive('mimetype', function () {

    var mapping = {
      pdf: 'application-pdf'
    };

    function getMimetypeClass(mimeType, extension) {

      var myClass;

      if (mimeType === 'folder') {
        myClass = 'icon-folder-close icon-blue';
      } else if (extension && mapping[extension]) {
        myClass = 'mimetype mimetype-' + mapping[extension];
      } else if (mimeType) {
        myClass = 'mimetype mimetype-' + mimeType.replace(/\/x-/g, '/').replace(/\//g, '-');
      } else {
        myClass = 'mimetype';
      }
      return myClass;
    }

    return {
      restrict: 'E',
      template: '<i class="{{c}}"></i>',
      scope: {
        type: '@'
      },
      link: function link(scope, element, attrs) {

        var extension = (attrs.name || '').toLowerCase().split('.').pop();

        scope.c = getMimetypeClass(attrs.type, extension);
      }
    };

  });