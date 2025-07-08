define(['jquery', 'header', 'json!common', 'json!cache', 'cnr/cnr.bulkinfo', 'cnr/cnr.search', 'cnr/cnr.url', 'i18n', 'cnr/cnr.ui',
        'cnr/cnr.actionbutton', 'cnr/cnr.jconon', 'handlebars', 'cnr/cnr', 'moment', 'cnr/cnr.application', 'cnr/cnr.criteria',
        'cnr/cnr.ace', 'cnr/cnr.call', 'cnr/cnr.node'], function ($, header, common, cache, BulkInfo, Search, URL, i18n, UI,
        ActionButton, jconon, Handlebars, CNR, moment, Application, Criteria, Ace, Call, Node) {
  "use strict";
  var close = UI.progress();
  jconon.Data.call.convocazione.examSessions({
    placeholder: {
      "id" : params.callId
    },
    success: function (dati) {
      // Popola la select con le chiavi
      const $select = $('#exams');
      Object.keys(dati).forEach(key => {
        $select.append(new Option(key, key));
      });
      // Inizializza Select2
      $select.select2();
      if (Object.keys(dati).length == 0) {
        $('#emptyResultset').toggle();
        return;
      }
      // Al cambio, aggiorna la tabella
      $select.on('change', function () {
        const chiave = $(this).val();
        const righe = dati[chiave];
        const $tbody = $('#tabella tbody');
        $tbody.empty();

        righe.forEach(p => {
          var trClass = moment(p.date) > moment(p.documentDate, "DD/MM/YYYY") ? 'error' : 'success';
          $tbody.append(`
            <tr class="${trClass}">
              <td></td>
              <td>${p.firstName}</td>
              <td>${p.lastName}</td>
              <td>${p.fiscalCode}</td>
              <td>${p.birthdate}</td>
              <td>${p.documentType}</td>
              <td>${p.documentNumber}</td>
              <td>${p.documentDate}</td>
              <td>${p.documentIssuedBy}</td>
              <td><b>${p.uid}</b></td>
            </tr>
          `);
        });
      });
      // Seleziona il primo valore inizialmente
      $select.val($select.find('option:first').val()).trigger('change');
    },
    complete: close
  });

  function salvaCSV(data, status, xhr) {
      // Recupera il filename dal Content-Disposition (opzionale)
      const header = xhr.getResponseHeader('Content-Disposition');
      let filename = 'utenti.csv';
      if (header && header.indexOf('filename=') !== -1) {
        filename = header
          .split('filename=')[1]
          .split(';')[0]
          .replace(/['"]/g, '');
      }

      // Crea il link per il download
      const blob = new Blob([data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
  }

  $('#esporta').off().on('click', function () {
    var close = UI.progress();
      jconon.Data.call.convocazione.examSessions({
        type: 'POST',
        placeholder: {
          "id" : params.callId
        },
        data:  {
          session : $('#exams').val()
        },
        success: function (data, status, xhr) {
            salvaCSV(data, status, xhr);

        },
        complete: close,
        error: URL.errorFn
    });
  });

  $('#esportaMoodle').off().on('click', function () {
    var close = UI.progress();
      jconon.Data.call.convocazione.examMoodleSessions({
        type: 'POST',
        placeholder: {
          "id" : params.callId
        },
        data:  {
          session : $('#exams').val()
        },
        success: function (data, status, xhr) {
            salvaCSV(data, status, xhr);

        },
        complete: close,
        error: URL.errorFn
    });
  });
});