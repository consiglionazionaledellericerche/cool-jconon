'use strict';

angular.module('flowsApp')
  .factory('dataService', function ($http, $location, $rootScope) {

    var development = $location.$$port === 9000; //GRUNT PORT;
    var proxy = 'proxy?url=';
    var base = (development ? '/cool-flows/' : '') + 'rest/';

    $rootScope.development = development;

    function ajax (url, settings) {
      var defaults = {
        method: 'GET',
        headers: {
          'X-CNR-Client': 'flowsApp'
        }
      };

      var conf = _.extend({
        url: base + url
      }, defaults, settings);

      console.log(conf);

      return $http(conf);
    }

    return {
      urls: {
        drop: base + 'drop',
        proxy: base + proxy,
        content: base + 'content'
      },
      search: function (params) {
        //TODO: impostare dei defaults per params
        return ajax('search', {
          params: params
        });
      },
      security: {
        login: function (username, password) {
          return ajax('security/login', {
            method: 'POST',
            data: {
              username: username,
              password: password
            }
          });
        }
      },
      common: function () {
        return ajax('common');
      },
      i18n: function () {
        return ajax('i18n');
      },
      bulkInfo: function (key, name) {
        return ajax('bulkInfo/view/' + key + '/form/' + (name || 'default'));
      },
      proxy: {
        cnr: {
          workflow: {
            metadata: function (qname, id) {
              return ajax(proxy + 'service/cnr/workflow/metadata', {
                params: {
                  properties: qname,
                  assignedByMeWorkflowIds: id
                }
              });
            }
          },
          groups: {
            myGroupsDescendant: function (userId) {
                // params: {
                //   //zone: 'AUTH.EXT.ldap1'
                // }
              return ajax(proxy + 'service/cnr/groups/my-groups-descendant/' + userId);
            }
          }
        },
        api: {
          formProcessor: function (processName, data) {
            return ajax(proxy + 'service/api/workflow/' + processName + '/formprocessor', {
              method: 'POST',
              data: data
            });
          },
          taskInstances: function (params, id, data) {
            return ajax(proxy + 'service/api/task-instances' + (id ? ('/' + id) : ''), {
              method: data ? 'PUT' : 'GET',
              params: params,
              data: data
            });
          },
          workflowDefinitions: function (definitionId) {
            return ajax(proxy + 'service/api/workflow-definitions/' + definitionId);
          }

        }
      }
    };


  });