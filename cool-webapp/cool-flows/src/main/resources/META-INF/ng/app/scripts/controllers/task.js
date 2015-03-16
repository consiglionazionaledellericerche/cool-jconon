'use strict';

angular.module('flowsApp')
  .controller('TaskCtrl', function ($scope, dataService, $location, $routeParams, $rootScope, stepService, $q, $log) {

    $scope.uploadContent = function () {
      $log.debug('richiesto file upload');
    };

    function getDocuments(wfpackage) {

      var deferred = $q.defer();

      dataService.descendants(wfpackage).success(function (data) {
        var documents = data.items;
        var main = [], aux = [];
        _.each(documents, function (doc) {
          if (doc['wfcnr:tipologiaDOC'] === 'Principale') {
            main.push(doc);
          } else {
            aux.push(doc);
          }
        });

        deferred.resolve({
          main: main,
          aux: aux
        });

      });

      return deferred.promise;

    }

    var endTask;

    $scope.hidden = true;

    var s = [
      {
        label: 'azioni',
        key: 'start'
      }
    ];

    function setStep(index) {
      $scope.step = _.extend({}, $scope.steps[index], {step: index});
    }

    $scope.$watch('bulkinfoData', function (val) {
      var v = stepService.getSteps(val, s);
      if (v) {
        $scope.steps = v;
        setStep(1);
      }
    });


    $scope.steps = s;

    setStep(0);

    $scope.changeStep = function (n) {
      if ($scope.step.key === 'metadata' && $scope.step.step === n - 1) {
        endTask(n);
      } else {
        setStep(n);
      }
    };

    $rootScope.page = null;
    $scope.tempId = new Date().getTime();


    var id = $routeParams.id;

    dataService.proxy.api.taskInstances({detailed: true}, id).success(function (data) {
      var task = data.data;
      if (task.properties.wfcnr_dettagliFlussoJson) {
        task.properties.wfcnr_dettagliFlussoJson = JSON.parse(task.properties.wfcnr_dettagliFlussoJson);
      }
      $scope.task = task;
      $scope.diagramUrl = dataService.urls.proxy + 'service/api/workflow-instances/' + task.workflowInstance.id + '/diagram' + '&' + new Date().getTime();

      $scope.$watch('updated', function () {

        getDocuments(task.workflowInstance.package).then(function (data) {
          $scope.main = data.main;
          $scope.aux = data.aux;
        });
      });

      //load transition choices

      dataService.bulkInfo('D:' + task.definition.id).success(function (transitionsData) {
        $log.debug(transitionsData);

        var outcomeKey =  'wfcnr:reviewOutcome',
          actions = transitionsData['default'],
          transitions = actions[outcomeKey] || actions['wf:reviewOutcome'],
          taskDone = [{
            key: 'Done',
            label: 'Eseguito'
          }]; // 'task done' will be the default transition, if no transition has been defined

        $scope.defaultTransition = transitions['default'];
        $scope.transitions = transitions ? transitions.jsonlist : taskDone;

        $scope.action = function (key) {

          $scope.bulkInfoSettings = {
            name: key,
            key: transitionsData.cmisObjectTypeId
          };

          $scope.hidden = false;

          $scope.choice = key;


          endTask = function (n) {

            var content = $scope.bulkinfoData.get(true);
            content.prop_folder = $scope.folder;
            content.prop_transitions = 'Next';
            content['prop_' + outcomeKey.replace(':', '_')] = key;

            dataService.proxy.api.task.formprocessor(task.id, content)
              .success(function (data) {
                $log.debug(data);
                $scope.success = {
                  key: key,
                  message: data.message
                };

                dataService.proxy.api.taskInstances({detailed: true}, id).success(function (data) {
                  var task = data.data;
                  $scope.task = task;

                  function clerAllowableActions(items) {
                    return _.map(items, function (el) {
                      el.allowableActions = [];
                      return el;
                    });

                  }

                  getDocuments(task.workflowInstance.package).then(function (data) {


                    $scope.main = clerAllowableActions(data.main);
                    $scope.aux = clerAllowableActions(data.aux);
                  });

                });


                setStep(n);
              })
              .error(function (err) {
                $log.debug(arguments);
                $scope.error = err.message;
              });

          };



        };

      });

    });

  });
