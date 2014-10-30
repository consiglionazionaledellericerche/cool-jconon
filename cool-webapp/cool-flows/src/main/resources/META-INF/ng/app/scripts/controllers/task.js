'use strict';

angular.module('flowsApp')
  .controller('TaskCtrl', function ($scope, dataService, $location, $routeParams, $rootScope) {

      $rootScope.page = null;
      $scope.tempId = new Date().getTime();

      $scope.urlContent = dataService.urls.content;
      $scope.urlProxy = dataService.urls.proxy;

      var id = $routeParams.id;

      dataService.proxy.api.taskInstances({detailed: true}, id).success(function (data) {
        var task = data.data;
        $scope.task = task;

        dataService.search({
          maxItems: 100,
          skipCount: 0,
          fetchCmisObject: false,
          calculateTotalNumItems: false,
          q: 'SELECT * FROM cmis:document c join wfcnr:parametriFlusso a on c.cmis:objectId = a.cmis:objectId WHERE IN_FOLDER(c, \'' + task.workflowInstance.package + '\') ORDER BY c.cmis:lastModificationDate DESC'
        }).success(function (data) {
          var documents = data.items;
          var main = [], aux = [];
          _.each(documents, function (doc) {
            if (doc['wfcnr:tipologiaDOC'] === 'Principale') {
              main.push(doc);
            } else {
              aux.push(doc);
            }
          });

          $scope.main = main;
          $scope.aux = aux;

        });

        //load transition choices

        dataService.bulkInfo('D:' + task.definition.id).success(function (transitionsData) {
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

          $scope.endTask = function (key) {

            dataService.bulkInfo(transitionsData.cmisObjectTypeId, key).success(function (form) {
              $scope.formElements = form[key];
              // endTask(bulkInfo, transition.key);
            });
          };

        });

      });

    });