'use strict';


angular.module('flowsApp')
  .controller('StartWorkflowCtrl', function ($scope, dataService, $location, $routeParams, $rootScope, stepService, $log) {

    $scope.tempId = new Date().getTime();
    $rootScope.page = null;


    function setStep(index) {
      $scope.step = _.extend({}, $scope.steps[index], {step: index});
    }

    $scope.$watch('bulkinfoData', function (val) {
      var s = [{
        key: 'diagram',
        label: 'diagramma di flusso'
      }];

      var v = stepService.getSteps(val, s);
      if (v) {
        $scope.steps = v;
        setStep(0);
      }

    });


    var definitionId = $routeParams.id;

    // copiato da cool-doccnr/src/main/resources/META-INF/js/ws/workflow/main.get.js

    dataService.proxy.api.workflowDefinitions(definitionId).success(function (definition) {

      var process = definition.data;
      var processName = process.name;
      $scope.diagramUrl = dataService.urls.proxy + 'service/cnr/workflow/diagram.png?definitionId=' + process.id;

      $scope.workflow = {
        title: process.title,
        description: process.description
      };

      $scope.bulkInfoSettings = {
        key: 'D:' + process.startTaskDefinitionType
      };

      $scope.changeStep = function (n) {
        if ($scope.step.key === 'metadata' && $scope.step.step === n - 1) {

          var data;
          try {
            data = $scope.bulkinfoData.get(true);
          } catch(error) {
            $scope.error = error;
            return;
          }

          if ($scope.folder) {
            data.assoc_packageItems_added = 'workspace://SpacesStore/' + $scope.folder;
          }

          dataService.proxy.api.workflow.formprocessor(processName, data).success(function (data) {

            if (data.persistedObject) {

              var re = /id=([a-z0-9\$]+)/gi, id = re.exec(data.persistedObject)[1],
                qname = '{http://www.cnr.it/model/workflow/1.0}wfCounterId';

              setStep(n);

              dataService.proxy.cnr.workflow.metadata(qname, id).success(function (props) {
                $scope.success = 'workflow ' + props.theirs[id][qname] + ' avviato con successo';

                $scope.workflowStarted = {
                  metadata: props,
                  response: data
                };

              }).error(function () {
                $scope.success = 'workflow ' + processName + ' avviato con successo';
              });

            } else {
              $scope.error = 'impossibile avviare il workflow';
            }

            $log.debug(data);
          }).error(function (xhr) {

            var msg;
            try {
              var regexGroups = /^.*[0-9]+ Error: (.*)\(.*\)$/g.exec(xhr.message);
              msg = regexGroups.length > 1 ? regexGroups[1] : '';
              $log.debug(arguments);
            } catch(error) {
              msg = xhr.message;
            }
           $scope.error= 'impossibile avviare il workflow: ' + msg;
          });

        } else {
          setStep(n);

        }
      };

    });

  });
