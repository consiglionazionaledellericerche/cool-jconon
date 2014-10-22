    function BulkInfo (opts) {

      return {
        render: function () {

          var defaults = {
            path: 'cmis:document',
            kind: 'form',
            name: 'default'
          };

          var settings = _.extend({}, defaults, opts);

          var xhr = $http({
            url: '/cool-flows/rest/bulkInfo/view/' + settings.path + '/' + settings.kind + '/' + settings.name,
            method: 'GET',
            params: {
              'cmis:objectId': settings.objectId,
              guest: true
            }
          });

          xhr.success(function renderData(data){

            if (data.forms.length !== 1) {
              throw new Error('errore nei form');
            } else {
              var form = data[data.forms[0]];
              console.log(form);
            }

          });

          return xhr;

        }
      };
    }