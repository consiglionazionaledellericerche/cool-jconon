'use strict';


angular.module('flowsApp')
  .controller('SearchCtrl', function ($scope, $rootScope, modalService, dataService, $routeParams) {

    $rootScope.page = 'search';
    $scope.urlContent = dataService.urls.content;

    var query = $routeParams.query;

    $scope.query = query;

    dataService.search({
      maxItems: 20,
      skipCount: 0,
      fetchCmisObject: false,
      calculateTotalNumItems: false,
      q: 'SELECT a.* FROM ' +
         // 'cmis:document c join ' +
         ' wfcnr:parametriFlusso a' +
         // ' on c.cmis:objectId = a.cmis:objectId ' +
         ' WHERE CONTAINS(a, \'' + query + '\') ' +
         ' ORDER BY a.cmis:lastModificationDate DESC'
    }).success(function (data) {
      var documents = data.items;

      $scope.results = documents;
      $scope.totalNumItems = data.totalNumItems;
    });



  });
