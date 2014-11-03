'use strict';


angular.module('flowsApp')
  .controller('StartWorkflowCtrl', function ($scope, dataService, $location, $routeParams, $rootScope) {

    $scope.tempId = new Date().getTime();
    $rootScope.page = null;

    $scope.step = 0;
    $scope.steps = ['diagramma di flusso', 'inserimento documenti principali', 'inserimento allegati', 'inserimento metadati', 'riepilogo'];

    dataService.common().success(function (data) {

      var definitionId = $routeParams.id;

      $scope.common = data.User;
      var definitions = data.workflowDefinitions;
      //$scope.workflowDefinitions = definitions;

      //TODO: forse lo trovo anche in process ???
      var workflow = _.filter(definitions, function (definition) {
        return definition.id === definitionId;
      })[0];

      $scope.workflow = workflow;

      $scope.diagramUrl = dataService.urls.proxy + 'service/cnr/workflow/diagram.png&definitionId=' + workflow.id;

      // copiato da cool-doccnr/src/main/resources/META-INF/js/ws/workflow/main.get.js

      dataService.proxy.api.workflowDefinitions(definitionId).success(function (definition) {

        var process = definition.data;
        var processName = process.name;

        $scope.bulkInfoSettings = {
          key: 'D:' + process.startTaskDefinitionType
        };

        $scope.changeStep = function (n) {
          if (n === 4) {

            var data = $scope.bulkinfoData.get();

            data.assoc_packageItems_added = 'workspace://SpacesStore/' + $scope.folder;

            dataService.proxy.api.workflow.formprocessor(processName, data).success(function (data) {

              if (data.persistedObject) {

                var re = /id=([a-z0-9\$]+)/gi, id = re.exec(data.persistedObject)[1],
                  qname = '{http://www.cnr.it/model/workflow/1.0}wfCounterId';

                $scope.step = n;

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

              console.log(data);
            }).error(function () {
              console.log(arguments);
              $scope.error= 'impossibile avviare il workflow';
            });

          } else {
            $scope.step = n;
          }
        };

      });

    });

  });
