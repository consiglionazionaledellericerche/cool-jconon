'use strict';

angular.module('flowsApp')
  .factory('logoutService', function ($location, $sessionStorage, $rootScope) {

    return {
      logout: function () {
        $sessionStorage.user = null;
        $rootScope.user = null;
        $location.path('/login');
      }
    };

  });