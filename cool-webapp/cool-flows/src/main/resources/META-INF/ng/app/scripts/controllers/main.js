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

        var tasks = data.data;

        var filters = {};

        function filter(key, value) {
          filters[key] = value;


          var filteredTasks =  _.filter(tasks, function (task) {

            if (filters.priority && task.properties.bpm_priority != filters.priority) {
              return false;
            }

            if (filters.initiator && task.workflowInstance.initiator.userName !== filters.initiator) {
              return false;
            }

            if (filters.dueDate) {
              //TODO: gestire
              return false;
            }

            return true;
          });


          // scrivere summary
          var priorities = {
              low: 0,
              mid: 0,
              high: 0
            },
            expiring = 0,
            expired = 0,
            now = new Date().getTime();

          _.each(tasks, function (task) {

            // priority
            if (task.properties.bpm_priority === 5) {
              ++priorities.high;
            } else if (task.properties.bpm_priority === 3) {
              ++priorities.mid;
            }

            // expired
            if (new Date(task.properties.bpm_dueDate).getTime() < now) {
              ++expired;
            }

            // about to expire
            // una settimana
            var delta = new Date(task.properties.bpm_dueDate).getTime() - now;
            if (delta > 0 && delta < (7 * 24 * 60 * 60 * 1000)) {
              ++expiring;
            }

          });

          $scope.summary = {
            chart: {
              high: 100 * priorities.high / tasks.length,
              mid: 100 * priorities.mid / tasks.length,
              low: 100 * (tasks.length - priorities.mid - priorities.high) / tasks.length
            },
            total: tasks.length,
            expired: expired,
            expiring: expiring
          };

          $scope.tasks = _.groupBy(filteredTasks, function (el) {
            return el.workflowInstance.title;
          });

          $scope.filters = filters;
        }

        $scope.filter = filter;

        filter({});

        var availableFilters = {
          priority: {
            '1': 'bassa',
            '3': 'media',
            '5': 'alta'
          },
          initiator: {
            'spaclient': 'Marco Spasiano',
            'francesco.uliana': 'Francesco Uliana'
          },
          dueDate: {
            '-1': 'expired',
           ' 7': 'week',
            '31': 'month'
          }
        };

        $scope.availableFilters = availableFilters;

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
      var url = dataService.urls.proxy + 'service/cnr/workflow/diagram.png&definitionId=' + workflowDefinition.id;
      modal(workflowDefinition.title, url);
    };

    $scope.modalTaskDiagram = function (task) {
      var url = dataService.urls.proxy + 'service/api/workflow-instances/' + task.workflowInstance.id + '/diagram';
      modal(task.description, url);
    };



  });