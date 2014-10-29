'use strict';


angular.module('flowsApp')
  .controller('StartWorkflowCtrl', function ($scope, $http, $location, $routeParams, $rootScope) {

    $rootScope.page = null;

    $scope.step = 0;
    $scope.steps = ['diagramma di flusso', 'inserimento documenti principali', 'inserimento allegati', 'inserimento metadati', 'riepilogo'];

    $http({
      url: '/cool-flows/rest/common',
      method: 'GET'
    }).success(function (data) {

      var definitionId = $routeParams.id;

      $scope.common = data.User;
      $scope.workflowDefinitions = data.workflowDefinitions;

      var definitions = data.workflowDefinitions;


      //TODO: forse lo trovo anche in process ???
      var workflow = _.filter(definitions, function (definition) {
        return definition.id === definitionId;
      })[0];

      $scope.workflow = workflow;

      $scope.diagramUrl = '/cool-flows/rest/proxy' + '?url=service/cnr/workflow/diagram.png&definitionId=' + workflow.id;

      // copiato da cool-doccnr/src/main/resources/META-INF/js/ws/workflow/main.get.js

      $http({
        url: '/cool-flows/rest/proxy' + '?url=service/api/workflow-definitions/' + definitionId,
        method: 'GET',
      }).success(function (definition) {

        var process = definition.data;
        var processName = process.name;

        $http({
          method: 'GET',
          url: '/cool-flows/rest/bulkInfo/view/D:' + process.startTaskDefinitionType + '/form/default'
        }).success(function (form) {
          $scope.formElements = form['default'];
        });


        $scope.changeStep = function (n) {
          if (n === 4) {

            var data = {
              assoc_packageItems_added: 'workspace://SpacesStore/' + $scope.folder
            };

            _.each($scope.formElements, function (item) {
              data['prop_' + item.property.replace(':', '_')] = item['ng-value'];
            });

            $http({
              url: '/cool-flows/rest/proxy' + '?url=service/api/workflow/' + processName + '/formprocessor',
              method: 'POST',
              data: data
            }).success(function (data) {

              if (data.persistedObject) {

                var re = /id=([a-z0-9\$]+)/gi, id = re.exec(data.persistedObject)[1],
                  qname = '{http://www.cnr.it/model/workflow/1.0}wfCounterId';

                $scope.step = n;

                $http({
                  method: 'GET',
                  url: '/cool-flows/rest/proxy' + '?url=service/cnr/workflow/metadata',
                  params: {
                    properties: qname,
                    assignedByMeWorkflowIds: id
                  }
                }).success(function (props) {
                  $scope.success = 'workflow ' + props.theirs[id][qname] + ' avviato con successo';
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
