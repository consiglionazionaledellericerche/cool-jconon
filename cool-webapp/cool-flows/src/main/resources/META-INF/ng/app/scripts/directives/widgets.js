'use strict';

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
  .directive('cnrWidgetSelect', function () {
    return {
      restrict: 'AE',
      ztemplate: '<span ng-repeat="choice in item.jsonlist">{{choice.label}}</span>',
      templateUrl: 'views/cnr-ui-select.html',
      link: function link(scope) {
        scope.select = function (val) {
          scope.$parent.item['ng-value'] = val;
        };
      }

    };
  })
  .directive('cnrWidgetDatepicker', function () {
    return {
      restrict: 'AE',
      template: '<input type="text" class="form-control" />',
      link: function link(scope, element) {
        element.children('input').datepicker({
          language: 'it'
        }).on('changeDate', function (el) {
          var d = el.date.toISOString();
          scope.$parent.item['ng-value'] = d;
        });
      }
    };
  })
  .directive('cnrWidgetGroup', function (dataService) {
    return {
      restrict: 'AE',
      template: '<div class="dropdown">' +
        '<button class="btn btn-default dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown">{{selected}}<span class="caret"></span></button>' +
        '<ul class="dropdown-menu" role="menu" aria-labelledby="dropdownMenu1">' +
        //'<li role="presentation"><a role="menuitem" tabindex="-1" href="#">Action</a></li>' +
        '<li ng-repeat="group in groups"><a ng-click="select(group.key, group.value.displayName)">{{group.level | indent}} {{group.value.displayName}}</a></li>' +

        '</ul></div>',
      link: function link(scope) {

        //FIXME: ricavare utenza ???


        scope.selected = 'nessuno';

        dataService.proxy.cnr.groups.myGroupsDescendant(userId).success(function (data) {


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
      link: function link(scope, element) {
        $(element).on('change', function (event) {
          scope.$parent.item['ng-value'] = event.target.value;
        });

      },
      template: '<div class="btn-group" data-toggle="buttons">' +
        '<label class="btn btn-default" ng-repeat="choice in $parent.item.jsonlist">' +
        '<input type="radio" ng-model="$parent.item[\'ng-value\']" name="options" value="{{choice.key}}" > {{choice.defaultLabel}}' +
        '</label>' +
        '</div>'
    };
  });
