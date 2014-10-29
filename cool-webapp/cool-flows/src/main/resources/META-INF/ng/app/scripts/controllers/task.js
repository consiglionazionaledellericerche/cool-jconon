'use strict';

angular.module('flowsApp')
  .controller('TaskCtrl', function ($scope, dataService, $location, $routeParams, $rootScope) {

      $rootScope.page = null;

      var id = $routeParams.id;

      dataService.proxy.api.taskInstances({detailed: true}, id).success(function (data) {
        $scope.task = data.data;



        //load transition choices

        dataService.bulkInfo(data.data.definition.id).success(function (transitionsData) {
          console.log(transitionsData);

          var outcomeKey =  'wfcnr:reviewOutcome',
            actions = transitionsData['default'],
            transitions = actions[outcomeKey] || actions['wf:reviewOutcome'],
            taskDone = [{
              key: 'Done',
              label: 'Eseguito'
            }]; // "task done" will be the default transition, if no transition has been defined


          $scope.defaultTransition = transitions['default'];
          $scope.transitions = transitions ? transitions.jsonlist : taskDone;

        });


      });

    });