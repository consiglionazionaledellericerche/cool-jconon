'use strict';

angular.module('flowsApp')
  .factory('i18nService', function ($http) {

    var dictionary;

    $http({
      method: 'GET',
      url: '/cool-flows/rest/i18n'
    }).success(function (data) {
      dictionary = data;
    });

    return {
      i18n: function (label) {
        return dictionary[label] || label;
      }
    };

  });