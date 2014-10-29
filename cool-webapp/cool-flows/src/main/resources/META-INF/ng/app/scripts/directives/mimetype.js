'use strict';

angular.module('flowsApp')
  .directive('mimetype', function () {

    function getMimetypeClass(mimeType, name) {
      var path, myClass, mapping = {
        pdf: 'application-pdf'
      }, extension = (name || '').toLowerCase().split('.').pop();

      if (mimeType === 'folder') {
        myClass = 'icon-folder-close icon-blue';
      } else if (name && mapping[extension]) {
        myClass = 'mimetype mimetype-' + mapping[extension];
      } else if (mimeType) {
        path = mimeType.replace(/\/x-/g, '/').replace(/\//g, '-');
        myClass = 'mimetype mimetype-' + path;
      } else {
        myClass = 'mimetype';
      }
      return myClass;
    }

    return {
      restrict: 'E',
      template: '<i></i>',
      link: function link(scope, element, attrs) {
        var c = getMimetypeClass(attrs.type, attrs.name);
        element.children('i').addClass(c);
      }
    };

  });