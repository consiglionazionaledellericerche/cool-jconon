'use strict';

angular.module('flowsApp')
  .directive('workflowTypes', function ($location, $anchorScroll) {

    return {
      restrict: 'E',
      templateUrl: 'views/workflow-types.html',
      scope: {
        tasks: '='
      },
      link: function link(scope, element, attrs) {

        scope.scrollTo = function(id) {
          var old = $location.hash();
          $location.hash(id);
          $anchorScroll();
          //reset to old to keep any additional routing logic from kicking in
          $location.hash(old);
        };


      }
    };

  });