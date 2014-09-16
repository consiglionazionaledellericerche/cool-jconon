(function () {

  'use strict';

  /**
   * @ngdoc overview
   * @name metaInfApp
   * @description
   * # metaInfApp
   *
   * Main module of the application.
   */
  angular
    .module('metaInfApp', [
      'ngAnimate',
      'ngCookies',
      'ngResource',
      'ngRoute',
      'ngSanitize',
      'ngTouch'
    ])
    .config(function ($routeProvider) {
      $routeProvider
        .when('/', {
          templateUrl: 'res/views/main.html',
          controller: 'MainCtrl'
        })
        .when('/about', {
          templateUrl: 'res/views/about.html',
          controller: 'AboutCtrl'
        })
        .otherwise({
          redirectTo: '/'
        });
    });

}());