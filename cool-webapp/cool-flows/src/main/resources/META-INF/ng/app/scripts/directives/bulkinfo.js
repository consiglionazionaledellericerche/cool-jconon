'use strict';

angular.module('flowsApp')
  .directive('bulkinfo', function (dataService) {

    return {
      restrict: 'E',
      scope: {
        data: '=',
        formSettings: '='
      },
      link: function link(scope) {

        scope.$watch('formSettings', function (settings) {

          console.log(settings);
          if (settings) {

            dataService.bulkInfo(settings.key, settings.name).success(function (form) {
              var formElements = form[settings.name || 'default'];
              scope.formElements = formElements;
              scope.data = {
                files: {
                  attachments: formElements.nrDocAllegatiiUpload ? formElements.nrDocAllegatiiUpload.val : 0,
                  main: formElements.nrDocPrincipaliUpload ? formElements.nrDocPrincipaliUpload.val : 0,
                },
                get: function () {
                  var data = {};

                  _.each(formElements, function (item) {
                    data['prop_' + item.property.replace(':', '_')] = item['ng-value'];
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