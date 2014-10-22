'use strict';

var id = new Date().getTime();

var folder;

angular.module('flowsApp')
  .directive('dropArea', function () {
    return {
      restrict: 'AE',
      scope: false,
      link: function link(scope, element, attrs) {

        new Dropzone(element[0], {
          url: '/cool-flows/rest/drop',
          params: {
            username: localStorage.getItem('username'),
            id: id,
            type: attrs.documentType
          },
          success: function (file, response) {
            folder = response.folder;
            console.log(response.document.split(';')[0]);
          }
        });

      }
    };
  })
  .controller('StartWorkflowCtrl', function ($scope, $http, $location, $routeParams, $rootScope) {

    $rootScope.home = false;

    $scope.step = 0;
    $scope.steps = ['diagramma di flusso', 'inserimento documenti principali', 'inserimento allegati', 'inserimento metadati', 'riepilogo'];



    require(['cnr/cnr.bulkinfo', 'cnr/cnr.url', 'datepicker-i18n', 'datepicker', 'typeahead'], function (BulkInfo, URL) {

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

        $scope.diagramUrl = '/cool-flows/rest/proxy?url=service/cnr/workflow/diagram.png&definitionId=' + workflow.id;

        // copiato da cool-doccnr/src/main/resources/META-INF/js/ws/workflow/main.get.js

        $http({
          url: '/cool-flows/rest/proxy?url=service/api/workflow-definitions/' + definitionId,
          method: 'GET',
        }).success(function (definition) {

          var process = definition.data;
          var processName = process.name;

          var bulkinfo = new BulkInfo({
            target: $('#contenuto'),
            path: 'D:' + process.startTaskDefinitionType
          });
          bulkinfo.render();

          function retrieveAuthority (formData, groupAssigneeX, assigneeX) {
            var xhr, groupAssignee, assignee;

            groupAssignee = _.filter(formData, function (el) {
              return el.id === 'bpm:groupAssignee';
            });

            assignee = _.filter(formData, function (el) {
              return el.id === 'bpm:assignee';
            });

            if (groupAssignee.length) {
              xhr = URL.Data.proxy.groups({
                data: {
                  filter: groupAssigneeX
                }
              });
            } else if (assignee.length) {
              xhr = URL.Data.proxy.person({
                data: {
                  filter: assignee[0].value
                }
              });
            } else {
              xhr = $.Deferred();
              xhr.resolve();
            }

            return xhr.pipe(function (data) {

              var settings = {};

              if (groupAssignee.length) {
                settings.assoc_bpm_groupAssignee_added = data.groups[0].nodeRef;
              } else if (assignee.length) {
                settings.assoc_bpm_assignee_added = data.people[0].nodeRef;
              }

              return settings;
            });

          }



          function executeStartWorkflow(settings, processName) {

            return URL.Data.proxy.startWorkflow({
              placeholder: {
                workflowName: encodeURIComponent(processName)
              },
              data: JSON.stringify(settings),
              processData: false,
              contentType: 'application/json',
              type: 'POST'
            }).done(function (data) {
              if (data.persistedObject) {

                var re = /id=([a-z0-9\$]+)/gi, id = re.exec(data.persistedObject)[1],
                  cnrId,
                  qname = '{http://www.cnr.it/model/workflow/1.0}wfCounterId';

                URL.Data.proxy.workflowProperties({
                  traditional: true,
                  data: {
                    properties: [qname],
                    assignedByMeWorkflowIds: [id]
                  }
                }).then(function (props) {
                  console.log(props);
                  cnrId = props.theirs[id][qname];
                  window.alert('workflow ' + cnrId + ' avviato con successo');
                }, function () {
                  window.alert('workflow ' + processName + ' avviato con successo');
                });
              } else {
                window.alert('impossibile avviare il workflow');
              }
            }).error(function (jqXHR, textStatus, errorThrown) {
              var msg = JSON.parse(jqXHR.responseText).message;
              window.alert('errore:' + msg);
              console.log(msg, jqXHR, textStatus, errorThrown);
            });
          }


          function startWorkflow(nodes, formData, processName) {



            //FIXME...
            var groupAssignee = null;//$('#bpm\\:groupAssignee').val();
            var assignee = null; //$('#bpm\\:assignee').val();

            retrieveAuthority(formData, groupAssignee, assignee).done(function (settings) {

              settings.assoc_packageItems_added = nodes;

              _.map(formData, function (value) {
                if (value.name) {
                  if (value.name !== 'bpm:groupAssignee') {
                    settings['prop_' + value.name.replace(':', '_')] = (typeof value.value === 'boolean') ? (value.value.toString()) : value.value;
                  }
                }
              });

              executeStartWorkflow(settings, processName).done(function (data) {
                if (data.persistedObject) {
                  //TODO: disabilitare bottone start workflow
                }
              });
            });

            return false;
          }

          function startWorkflowBtn() {

            if (!bulkinfo.validate()) {
              window.alert('alcuni campi non sono corretti');
            } else {
              var formData = bulkinfo.getData();
              startWorkflow('workspace://SpacesStore/' + folder, formData, processName);
            }
          }

          $scope.changeStep = function (n) {

            //TODO: controllare esito
            if (n === 4) {
              startWorkflowBtn();
            } else {
              $scope.step = n;
            }

          };

        });



      });


    });


  });
