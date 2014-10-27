'use strict';

var id = new Date().getTime();

var folder;

angular.module('flowsApp')
  .directive('cnrWidget', function ($compile) {
    return {
      restrict: 'E',
      template: '<div></div>',
      link: function link(scope, element, attrs) {
        var type = 'cnr-widget-' + attrs.type.split('.')[1];
        var child = element.children();
        child.attr(type, true);
        $compile(child)(scope);
      }
    };
  })
  .directive('cnrWidgetGroup', function ($http) {
    return {
      restrict: 'AE',
      template: '<div class="dropdown">' +
        '<button class="btn btn-default dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown">{{selected}}<span class="caret"></span></button>' +
        '<ul class="dropdown-menu" role="menu" aria-labelledby="dropdownMenu1">' +
        //'<li role="presentation"><a role="menuitem" tabindex="-1" href="#">Action</a></li>' +
        '<li ng-repeat="group in groups"><a ng-click="select(group.key, group.value.displayName)">{{group.level | indent}} {{group.value.displayName}}</a></li>' +

        '</ul></div>',
      link: function link(scope) {

        var userId = 'spaclient'; //TODO: fixme

        scope.selected = 'nessuno';

        $http({
          method: 'GET',
          url: '/cool-flows/rest/proxy' + '?url=service/cnr/groups/my-groups-descendant/' + userId,
          params: {
            //zone: 'AUTH.EXT.ldap1'
          }
        }).success(function (data) {


          function getSubtree(items, level) {
            level = level || 0;

            var groups = [];

            _.each(items, function (value, key) {

              groups.push({
                key: key,
                value: data.detail[key],
                level: level
              });

              if (value !== true) {
                var subgroups = getSubtree(value, level + 1);
                groups = groups.concat(subgroups);
              }

            });

            return groups;

          }

          scope.groups = getSubtree(data.tree);

          scope.select = function (k, v) {
            scope.selected = v;
            scope.$parent.item['ng-value'] = k;
          };


        });


      }
    };
  })
  .directive('cnrWidgetRadio', function () {
    return {
      restrict: 'AE',
      template: '<div ng-repeat="choice in $parent.item.jsonlist">' +
        '<input type="radio" ng-model="$parent.item[\'ng-value\']" value="{{choice.key}}">' +
        '{{choice.defaultLabel}}</div>'
    };
  })
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

          $http({
            method: 'GET',
            url: '/cool-flows/rest/bulkInfo/view/D:' + process.startTaskDefinitionType + '/form/default'
          }).success(function (form) {
            $scope.formElements = form['default'];
          });


          $scope.changeStep = function (n) {
            if (n === 4) {
              var data = {};
              _.each($scope.formElements, function (item) {
                data[item.property] = item['ng-value'];
              });

              $http({
                url: '/cool-flows/rest/proxy' + '?url=service/api/workflow/' + processName + '/formprocessor',
                method: 'POST',
                data: data
              }).success(function (data) {
                console.log(data);
              });

            } else {
              $scope.step = n;
            }
          };

        });

      });

  });
