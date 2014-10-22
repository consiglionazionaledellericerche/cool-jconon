'use strict';

angular.module('flowsApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute'
])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl'
      })
      .when('/main', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/task/:id', {
        templateUrl: 'views/task.html',
        controller: 'TaskCtrl'
      })
      .when('/workflow/:id', {
        templateUrl: 'views/workflow.html',
        controller: 'WorkflowCtrl'
      })
      .when('/start-workflow/:id', {
        templateUrl: 'views/start-workflow.html',
        controller: 'StartWorkflowCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
