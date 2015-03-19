'use strict';


angular.module('flowsApp')
  .controller('SelectWorkflowCtrl', function ($scope, $rootScope, modalService, dataService) {

    $rootScope.page = 'select-workflow';

    dataService.common().success(function (data) {
      $scope.workflowDefinitions = data.workflowDefinitions;
    });

    $scope.modalWorkflowDiagram = function (workflowDefinition) {
      var url = dataService.urls.proxy + 'service/cnr/workflow/diagram.png?definitionId=' + workflowDefinition.id;
      modalService.simpleModal(workflowDefinition.title, url);
    };


  });
