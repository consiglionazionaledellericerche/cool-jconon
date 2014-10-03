'use strict';

angular.module('flowsApp')
  .controller('StartWorkflowCtrl', function ($scope, $http, $location, $routeParams) {

    $http({
      url: '/cool-flows/rest/common',
      method: 'GET'
    }).success(function (data) {
      $scope.common = data.User;
      $scope.workflowDefinitions = data.workflowDefinitions;


      var definitions = data.workflowDefinitions;

      var workflow = _.filter(definitions, function (definition) {
        return definition.id === $routeParams.id;
      })[0];

      $scope.workflow = workflow;

      $scope.diagramUrl = '/cool-flows/rest/proxy?url=service/cnr/workflow/diagram.png&definitionId=' + workflow.id;

    });

  });
