'use strict';

angular.module('flowsApp')
  .directive('bulkinfo', function (dataService, $q) {

    return {
      restrict: 'AE',
      scope: {
        data: '=',
        formSettings: '='
      },
      link: function link(scope) {

        scope.$watch('formSettings', function (settings) {

          console.log(settings);
          if (settings) {



            var deferred = $q.defer();

            var xhr = dataService.bulkInfo(settings.key, settings.name, settings.type);

            xhr.success(function (data) {

              //TODO: mettere i nomi dei task corretti, esternalizzare questa configurazione
              if (settings.key === 'D:wf:submitReviewTaskZZ') {

                dataService.proxy.missioni.bulkInfo().success(function (dataGF) {
                  var merged = _.extend({}, data, {
                    buttami: dataGF
                  });
                  deferred.resolve(merged);
                });

              } else {
                deferred.resolve(data);
              }

            });

            deferred.promise.then(function (form) {
              var formElements = form[settings.name || 'default'];

              // preserve order...
              var a = [];
              _.each(formElements, function (el) {
                a.push(el);
              });
              scope.formElements = a;
              scope.data = {
                files: {
                  attachments: formElements.nrDocAllegatiiUpload ? formElements.nrDocAllegatiiUpload.val : 0,
                  main: formElements.nrDocPrincipaliUpload ? formElements.nrDocPrincipaliUpload.val : 0,
                },
                get: function (replace) {
                  var data = {};

                  _.each(formElements, function (item) {
                    var value = item['ng-value'];
                    var key;

                    if (replace) {
                      key = 'prop_' + item.property.replace(':', '_');
                    } else {
                      key = item.property;
                    }

                    data[key] = value;
                  });

                  return data;
                }
              };
            });

          }



        });
      },
      templateUrl: 'views/bulkinfo.html'
    };

  });
