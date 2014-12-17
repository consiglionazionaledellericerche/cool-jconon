'use strict';

angular.module('flowsApp')
  .controller('MainCtrl', function ($scope, dataService, $rootScope, modalService, $location, $anchorScroll) {

    $rootScope.page = 'main';


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

    // SUMMARY - tasks status report
    function getSummary (tasks) {

      var priorities = {
          low: 0,
          mid: 0,
          high: 0
        },
        expiring = 0,
        expired = 0,
        now = new Date().getTime(),
        oneWeek = 7 * 24 * 60 * 60 * 1000;

      _.each(tasks, function (task) {

        var dueDate = new Date(task.properties.bpm_dueDate).getTime();

        // priority
        if (task.properties.bpm_priority === 5) {
          ++priorities.high;
        } else if (task.properties.bpm_priority === 3) {
          ++priorities.mid;
        }

        // expired

        if (dueDate < now) {
          ++expired;
        }

        // about to expire
        if (dueDate > now && (dueDate - now) < oneWeek) {
          ++expiring;
        }

      });

      return {
        chart: {
          high: 100 * priorities.high / tasks.length,
          mid: 100 * priorities.mid / tasks.length,
          low: 100 * (tasks.length - priorities.mid - priorities.high) / tasks.length
        },
        total: tasks.length,
        expired: expired,
        expiring: expiring
      };

    }

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

    dataService.common().success(function (data) {

      //TODO: caricare dataService.common direttamente in fase di login e memorizzarlo su sessionStorage

      $rootScope.user = data.User;

      var username = data.User.id;

      //TODO: fare wrapper con JSON.stringify etc.
      localStorage.setItem('username', data.User.id);

      dataService.proxy.api.taskInstances({authority: username}).success(function (data) {

        var tasks = data.data;

        var filters = {};

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


          $scope.tasks = _.groupBy(filteredTasks, function (el) {
            return el.workflowInstance.title;
          });

          $scope.filters = filters;
        }


        $scope.summary = getSummary(tasks);


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

      });


      $scope.pooled = [];
      $scope.takeTask = function (id, user) {

        dataService.proxy.api.taskInstances(null, id, {'cm_owner': user || null}).success(function (data) {
          console.log(data);
          $scope.pooled[id] = user !== undefined;
        });
      };


    });

    $scope.modalTaskDiagram = function (task) {
      var url = dataService.urls.proxy + 'service/api/workflow-instances/' + task.workflowInstance.id + '/diagram';
      modalService.simpleModal(task.description, url);
    };

    $scope.getLabel = function (values, value) {
      return _.filter(values, function (item) {
        return item.key === value;
      })[0].label;
    };

    $scope.fields = [
      {
        key: 'dueDate',
        label: 'Scadenza'
      },
      {
        key: 'startDate',
        label: 'Data avvio'
      },
      {
        key: 'id',
        label: 'id flusso'
      },
      {
        key: 'priority',
        label: 'Priotitas'
      }
    ];


    $scope.scrollTo = function(id) {
      var old = $location.hash();
      $location.hash(id);
      $anchorScroll();
      //reset to old to keep any additional routing logic from kicking in
      $location.hash(old);
    };

  });