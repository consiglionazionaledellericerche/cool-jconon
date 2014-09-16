(function () {
  'use strict';

  angular.module('metaInfApp')
    .service('cnrService', function () {
      return {
        historic: 'org.activiti.engine.impl.persistence.entity.HistoricTaskInstanceEntity'
      };
    });

}());