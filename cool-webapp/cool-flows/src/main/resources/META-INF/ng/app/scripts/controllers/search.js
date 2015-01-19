'use strict';


angular.module('flowsApp')
  .controller('SearchCtrl', function ($scope, $rootScope, modalService, dataService, $routeParams) {

    $rootScope.page = 'search';
    $scope.urlContent = dataService.urls.content;

    function getCriteria(filters, table, query) {

      var m = _.map(filters, function (v, k) {
        if (v) {
          return 'CONTAINS(' + table + ', \'' + k + ':*' + v + '*\')';

        }
      });

      if (query) {
        m.push('CONTAINS(' + table + ', \'' + query + '\')');
      }

      return _.filter(m, function (item) {
        return item || false;
      }).join(' and ');

    }

    function search (query, filterz) {

      $scope.query = query;

      var table = 'a';

      var where = getCriteria(filterz, table, query);

      dataService.search({
        maxItems: 20,
        skipCount: 0,
        fetchCmisObject: false,
        calculateTotalNumItems: false,
        q: 'SELECT a.* FROM ' +
           // 'cmis:document c join ' +
           ' wfcnr:parametriFlusso ' + table + ' ' +
           // ' on c.cmis:objectId = a.cmis:objectId ' +
           (where ? ' WHERE ' + where + ' ' : '') +
           ' ORDER BY ' + table + '.cmis:lastModificationDate DESC'
      }).success(function (data) {
        var documents = data.items;

        $scope.results = documents;
        $scope.totalNumItems = data.totalNumItems;
      });
    }

    search($routeParams.query);

    $scope.bulkInfoSettings = {
      name: 'default',
      key: 'P:wfcnr_parametriFlusso',
      type: 'find'
    };

    $scope.doSearch = function (query, obj) {
      var filters = obj.get();
      search(query, filters);
    };

  });
