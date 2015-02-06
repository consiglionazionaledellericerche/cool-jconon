'use strict';

angular.module('flowsApp')
  .factory('logoutService', function ($location, $sessionStorage, $rootScope) {

    return {
      logout: function () {
        delete $sessionStorage.user;
        delete $sessionStorage.ticket;
        $rootScope.user = null;
        $location.path('/login');
      }
    };

  });