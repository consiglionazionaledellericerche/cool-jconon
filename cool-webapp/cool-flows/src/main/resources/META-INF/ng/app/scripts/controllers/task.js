'use strict';

angular.module('flowsApp')
  .controller('TaskCtrl', function ($scope, $http, $location, $routeParams) {

      var id = $routeParams.id;

      $http({
        method: 'GET',
        url: '/cool-flows/rest/proxy?url=service/api/task-instances/' + id,
        params: {
          detailed: true
        }
      }).success(function (data) {
        $scope.task = data.data;



        //load transition choices

        $http({
          method: 'GET',
          url: '/cool-flows/rest/bulkInfo/view/' + 'D:' + data.data.definition.id + '/form/default'
        }).success(function (transitionsData) {
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


    $http({
      url: '/cool-flows/rest/common',
      method: 'GET'
    }).success(function (data) {

        $scope.username = data.User.id;

        $scope.takeTask = function (user) {

          $http({
            method: 'PUT',
            url: '/cool-flows/rest/proxy?url=service/api/task-instances/' + id,
            data: {
              'cm_owner': user || null
            }
          }).success(function (data) {
            console.log(data);
          });
        };

    });



  });
