'use strict';

angular.module('flowsApp')
  .factory('logoutService', function ($location, $sessionStorage, $rootScope, $cookies) {

    return {
      logout: function () {
        delete $sessionStorage.user;
        delete $sessionStorage.ticket;
        $cookies.ticket = null;
        $rootScope.user = null;
        $location.path('/login');
      }
    };

  });