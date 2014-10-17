'use strict';

angular.module('flowsApp')
  .controller('MainCtrl', function ($scope, $http, modalService) {

    $http({
      url: '/cool-flows/rest/common',
      method: 'GET'
    }).success(function (data) {

      $scope.user = data.User;

      var username = data.User.id;

      //TODO: fare wrapper con JSON.stringify etc.
      localStorage.setItem('username', data.User.id);
      $scope.workflowDefinitions = data.workflowDefinitions;

      $http({
        method: 'GET',
        url: '/cool-flows/rest/proxy?url=service/api/task-instances',
        params: {
          authority: username
        }
      }).success(function (data) {
        $scope.tasks = data.data;
      });

      $http({
        url: '/cool-flows/rest/proxy?url=service/api/workflow-instances',
        method: 'GET',
        data: {
          initiator: username,
          state: 'active'
        }
      }).success(function (data) {
        $scope.startedWorkflows = data.data;
      });

    });

    $scope.showDialog = true;

    $scope.modalDiagram = function (workflowDefinition) {
      var url = '/cool-flows/rest/proxy?url=service/cnr/workflow/diagram.png&definitionId=' + workflowDefinition.id;
      var x = modalService.modal(workflowDefinition.title, '<img src="' + url + '" />');
      $('<div class="modal fade"></div>').append(x).modal();

    };

  });