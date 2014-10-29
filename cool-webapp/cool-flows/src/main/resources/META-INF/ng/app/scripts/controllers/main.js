'use strict';

angular.module('flowsApp')
  .controller('MainCtrl', function ($scope, dataService, modalService, $rootScope) {

    $rootScope.page = 'main';

    $scope.choice = 'tasks';

    $scope.show = function (what) {
      $scope.choice = what;
    };


    dataService.common().success(function (data) {

      $rootScope.user = data.User;

      var username = data.User.id;

      //TODO: fare wrapper con JSON.stringify etc.
      localStorage.setItem('username', data.User.id);
      $scope.workflowDefinitions = data.workflowDefinitions;

      dataService.proxy.api.taskInstances({authority: username}).success(function (data) {
        $scope.tasks = data.data;
      });


      $scope.pooled = [];
      $scope.takeTask = function (id, user) {

        dataService.proxy.api.taskInstances(null, id, {'cm_owner': user || null}).success(function (data) {
          console.log(data);
          $scope.pooled[id] = user !== undefined;
        });
      };


    });

    $scope.showDialog = true;

    function modal(title, url) {
      var modalContent = modalService.modal(title, '<img src="' + url + '" />');
      $('<div class="modal fade role="dialog" tabindex="-1"></div>').append(modalContent).modal();
    }

    $scope.modalWorkflowDiagram = function (workflowDefinition) {
      var url = '/cool-flows/rest/proxy' + '?url=service/cnr/workflow/diagram.png&definitionId=' + workflowDefinition.id;
      modal(workflowDefinition.title, url);
    };

    $scope.modalTaskDiagram = function (task) {
      var url = '/cool-flows/rest/proxy' + '?url=service/api/workflow-instances/' + task.workflowInstance.id + '/diagram';
      modal(task.description, url);
    };



  });