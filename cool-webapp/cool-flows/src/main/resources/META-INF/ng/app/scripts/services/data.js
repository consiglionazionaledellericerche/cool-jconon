'use strict';

angular.module('flowsApp')
  .factory('dataService', function ($http, $location, $rootScope, $log, $sessionStorage) {

    var development = $location.$$port === 9000; //GRUNT PORT;
    var proxy = 'proxy?url=';
    var base = (development ? '/cool-flows/' : '') + 'rest/';

    $rootScope.development = development;

    function ajax (url, settings) {
      var defaults = {
        method: 'GET',
        headers: {
          'X-CNR-Client': 'flowsApp',
          'X-alfresco-ticket': $sessionStorage.ticket
        }
      };

      var conf = _.extend({
        url: base + url
      }, defaults, settings);

      $log.debug(conf);

      return $http(conf);
    }

    return {
      urls: {
        drop: base + 'drop',
        dropupdate: base + 'drop-update',
        proxy: base + proxy,
        content: base + 'content',
        person: base + proxy + 'service/cnr/person/autocomplete-person'
      },
      search: function (params) {

        var defaultParams = {
          maxItems: 10,
          skipCount: 0,
          fetchCmisObject: false,
          calculateTotalNumItems: false
        };

        return ajax('search', {
          params: _.extend({}, defaultParams, params)
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
      bulkInfo: function (key, name, type) {
        return ajax('bulkInfo/view/' + key + '/' + (type || 'form') + '/' + (name || 'default'));
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

              return ajax(proxy + 'service/cnr/groups/my-groups-descendant/' + userId, {
                params: {
                  zone: 'AUTH.EXT.ldap1'
                }
              });
            }
          }
        },
        api: {
          workflow: {
            formprocessor: function (processName, data) {
              return ajax(proxy + 'service/api/workflow/' + processName + '/formprocessor', {
                method: 'POST',
                data: data
              });
            }
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
          },
          task: {
            formprocessor: function (taskId, content) {
              return ajax(proxy + 'service/api/task/' + taskId + '/formprocessor', {
                method: 'POST',
                data: content
              });
            }
          }
        }
        // missioni: {
        //   bulkInfo: function () {
        //     return ajax(proxy + '_nodes', {
        //       params: {
        //         backend: 'missioni',
        //       }
        //     });
        //   }
        // }
      }
    };


  });