'use strict';

angular.module('flowsApp')
  .directive('taskList', function (dataService, modalService, $sessionStorage) {

    return {
      restrict: 'E',
      scope: {
        tasks: '='
      },
      templateUrl: 'views/task-list.html',
      link: function (scope, element, attrs) {

        scope.completed = attrs.completed;

        scope.pooled = [];
        scope.takeTask = function (id, take) {

          var user;
          if (take === true) {
            user = $sessionStorage.user.id;
          }

          dataService.proxy.api.taskInstances(null, id, {'cm_owner': user || null}).success(function (data) {
            console.log(data);
            scope.pooled[id] = user !== undefined;
          });
        };

        scope.modalTaskDiagram = function (task) {
          var url = dataService.urls.proxy + 'service/api/workflow-instances/' + task.workflowInstance.id + '/diagram';
          modalService.simpleModal(task.description, url);
        };
      }
    };
  });