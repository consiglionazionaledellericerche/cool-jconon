'use strict';

angular.module('flowsApp')
  .factory('dataService', function ($http) {

    var baseProxy = 'proxy?url=';

    function ajax (url, settings) {
      var defaults = {
        method: 'GET',
        url: '/cool-flows/rest/' + url
      };

      var conf = _.extend({}, defaults, settings);
      return $http(conf);
    }


    return {
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
      bulkInfo: function (key) {
        return ajax('bulkInfo/view/D:' + key + '/form/default');
      },
      proxy: {
        cnr: {
          workflow: {
            metadata: function (qname, id) {
              return ajax(baseProxy + 'service/cnr/workflow/metadata', {
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
              return ajax(baseProxy + 'service/cnr/groups/my-groups-descendant/' + userId);
            }
          }
        },
        api: {
          formProcessor: function (processName, data) {
            return ajax(baseProxy + 'service/api/workflow/' + processName + '/formprocessor', {
              method: 'POST',
              data: data
            });
          },
          taskInstances: function (params, id, data) {
            return ajax(baseProxy + 'service/api/task-instances' + (id ? ('/' + id) : ''), {
              method: data ? 'PUT' : 'GET',
              params: params,
              data: data
            });
          },
          workflowDefinitions: function (definitionId) {
            return ajax(baseProxy + 'service/api/workflow-definitions/' + definitionId);
          }

        }
      }
    };


  });