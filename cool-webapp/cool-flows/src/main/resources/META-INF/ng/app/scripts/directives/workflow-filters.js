'use strict';

angular.module('flowsApp')
  .directive('workflowFilters', function () {


    function comparator(x, y) {
      if (x < y) {
        return -1;
      } else if (x > y) {
        return 1;
      } else {
        return 0;
      }
    }

    var extractors = {
      dueDate: function (item) {
        return item.properties.bpm_dueDate;
      },
      startDate: function (item) {
        return item.properties.bpm_startDate;
      },
      id: function (item) {
        return item.properties.wfcnr_wfCounterId;
      },
      priority: function (item) {
        return item.properties.bpm_priority;
      }
    };


    var availableFilters = [
      {
        key: 'priority',
        values: [
          {
            key: 1,
            label: 'bassa'
          },{
            key: 2,
            label: 'media'
          },{
            key: 3,
            label: 'alta'
          }
        ]
      }, {
        key: 'initiator',
        values: []
      }, {
        key: 'dueDate',
        values: [
          {
            key: -1,
            label: 'scaduto'
          },{
            key: 7,
            label: 'settimana'
          },{
            key: 31,
            label: 'mese'
          }
        ]
      }
    ];


    return {
      restrict: 'E',
      templateUrl: 'views/workflow-filters.html',
      scope: {
        tasks: '='
      },
      link: function link($scope) {


          var filters = {};

          var tasks = $scope.$parent.$parent.tasks;

          function filter(key, value) {
            filters[key] = value;

            var filteredTasks =  _.filter(tasks, function (task) {

              if (filters.priority && task.properties.bpm_priority !== filters.priority) {
                return false;
              }

              if (filters.initiator && task.workflowInstance.initiator.userName !== filters.initiator) {
                return false;
              }

              if (filters.dueDate) {

                var delta = new Date(task.properties.bpm_dueDate).getTime() - new Date().getTime();

                if (filters.dueDate === -1) {
                  return delta < 0;
                } else if (filters.dueDate === 7) {
                  return delta > 0 && delta < 7 * 24 * 60 * 60 * 1000;
                } else if (filters.dueDate ===  31) {
                  return delta > 0 && delta < 31 * 24 * 60 * 60 * 1000;
                } else {
                  console.log('error date filter: ' + filters.dueDate);
                }
              }

              return true;
            });


            $scope.$parent.$parent.tasks = _.groupBy(filteredTasks, function (el) {
              return el.workflowInstance.title;
            });

            $scope.filters = filters;
          }


          $scope.filter = filter;

          $scope.sortBy = function sortBy (field, asc) {

            asc = asc || 1;

            var tasks = $scope.tasks;

            var e = extractors[field];

            _.each(tasks, function (tasks) {
              tasks.sort(function (a, b) {
                return asc * comparator(e(a), e(b));
              });
            });

            $scope.sortCriteria = {
              field: field,
              asc: asc
            };


          };

          var initiators = _.map(tasks, function (task) {
            var initiator = task.workflowInstance.initiator;
            return {
              key: initiator.userName,
              label: initiator.firstName + ' ' + initiator.lastName,
            };
          });

          availableFilters[1].values = _.uniq(initiators, function(item) {
            return item.userName;
          });


          filter({});


          $scope.availableFilters = availableFilters;



      }
    };






  });