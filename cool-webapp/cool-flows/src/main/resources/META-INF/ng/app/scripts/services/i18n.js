'use strict';

angular.module('flowsApp')
  .factory('i18nService', function (dataService) {

    var dictionary;

    dataService.i18n().success(function (data) {
      dictionary = data;
    });

    return {
      i18n: function (label) {

        if (dictionary && dictionary[label]) {
          return dictionary[label];
        } else {
          return label;
        }

      }
    };

  });