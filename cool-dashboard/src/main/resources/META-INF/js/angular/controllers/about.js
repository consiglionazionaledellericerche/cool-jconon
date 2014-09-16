(function () {

  'use strict';

  /**
   * @ngdoc function
   * @name metaInfApp.controller:AboutCtrl
   * @description
   * # AboutCtrl
   * Controller of the metaInfApp
   */
  angular.module('metaInfApp')
    .controller('AboutCtrl', function ($scope) {
      $scope.awesomeThings = [
        'HTML5 Boilerplate',
        'AngularJS',
        'Karma'
      ];
    });

}());