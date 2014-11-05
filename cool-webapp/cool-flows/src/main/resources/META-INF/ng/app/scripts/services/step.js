'use strict';

angular.module('flowsApp')
  .factory('stepService', function () {

    return {
      getSteps: function (val, s) {

        if (val) {

          if (val.files.main > 0) {
            s.push({
              key: 'docMain',
              label: 'inserimento documenti principali'
            });
          }

          if (val.files.attachments > 0) {
            s.push({
              key: 'docAux',
              label: 'inserimento allegati'
            });
          }

          s.push({
            key: 'metadata',
            label: 'inserimento metadati'
          });
          s.push({
            key: 'summary',
            label: 'riepilogo'
          });

          return s;
        }
      }
    };
  });