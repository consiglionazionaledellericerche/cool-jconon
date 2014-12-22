'use strict';

angular.module('flowsApp')
  .constant('taskFilters', [
      {
        key: 'priority',
        values: [
          {
            key: 1,
            label: 'bassa'
          },{
            key: 3,
            label: 'media'
          },{
            key: 5,
            label: 'alta'
          }
        ]
      }, {
        key: 'initiator',
        values: []
      }, {
        key: 'dueDate',
        values: [
          {
            key: -1,
            label: 'scaduto'
          },{
            key: 7,
            label: 'settimana'
          },{
            key: 31,
            label: 'mese'
          }
        ]
      }
    ])
  .constant('taskFields', [
    {
      key: 'dueDate',
      label: 'Scadenza'
    },
    {
      key: 'startDate',
      label: 'Data avvio'
    },
    {
      key: 'id',
      label: 'Id flusso'
    },
    {
      key: 'priority',
      label: 'Priorita\''
    }
  ]);