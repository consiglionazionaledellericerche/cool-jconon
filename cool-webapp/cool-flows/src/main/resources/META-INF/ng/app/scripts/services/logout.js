'use strict';

angular.module('flowsApp')
  .factory('logoutService', function ($location, $sessionStorage, $rootScope, $cookies) {

    return {
      logout: function () {

        delete $sessionStorage.user;
        delete $sessionStorage.ticket;
        delete $cookies.ticket;
        $rootScope.user = null;
        $location.path('/login');

      }
    };

  });