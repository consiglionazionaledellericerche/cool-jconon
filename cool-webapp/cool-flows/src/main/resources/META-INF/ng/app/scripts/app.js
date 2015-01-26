'use strict';

angular.module('flowsApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'ngStorage'
], function($provide, $httpProvider) {

  $httpProvider.interceptors.push(function($q, logoutService) {
    return {

      responseError: function(rejection) {
        if (rejection.status === 401) {
          logoutService.logout();
        }
        return $q.reject(rejection);
      }
    };
  });

})
  .config(function ($routeProvider) {
    $routeProvider
      .when('/login', {
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl'
      })
      .when('/main', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/select-workflow', {
        templateUrl: 'views/select-workflow.html',
        controller: 'SelectWorkflowCtrl'
      })
      .when('/activities', {
        templateUrl: 'views/activities.html',
        controller: 'ActivitiesCtrl'
      })
      .when('/help', {
        templateUrl: 'views/help.html',
        controller: 'HelpCtrl'
      })
      .when('/monitoring', {
        templateUrl: 'views/monitoring.html',
        controller: 'MonitoringCtrl'
      })
      .when('/search/:query?', {
        templateUrl: 'views/search.html',
        controller: 'SearchCtrl'
      })
      .when('/task/:id', {
        templateUrl: 'views/task.html',
        controller: 'TaskCtrl'
      })
      .when('/start-workflow/:id', {
        templateUrl: 'views/start-workflow.html',
        controller: 'StartWorkflowCtrl'
      })
      .otherwise({
        redirectTo: '/login'
      });
  });



