define(['jquery', 'header', 'cnr/cnr.bulkinfo', 'cnr/cnr', 'cnr/cnr.url', 'cnr/cnr.jconon', 'json!common', 'cnr/cnr.ui', 'i18n'], function ($, header, BulkInfo, CNR, URL, jconon, common, UI, i18n) {
  "use strict";

  var nameForm = 'helpDesk',
    avvisi,
    helpDesk = $('#helpdesk2'),
    inputFile = $('<div class="control-group"><label for="message" class="control-label">' + i18n['label.allega'] + '</label><div class="controls"> <input type="file" title="Search file to attach" name="allegato" /> <br> <br> <input type="submit" class="btn btn-primary"  value="' + i18n['button.send'] + '"> </div></div>'),
// input nascosto per il widget category che non viene preso dal form ma vien settato onClic()
    categoryHidden = $('<input name="category" id="categoryHidden" type="hidden" />  '),
    btnReopen = $('<div class="text-center"> <button id="sendReopen" class="btn btn-primary">' + i18n['button.send'] + '<i class="ui-button-icon-secondary ui-icon ui-icon-mail-open" ></i></button> </div>');

  if (URL.querystring.from.id && URL.querystring.from.azione) {
    nameForm = 'reopen_HelpDesk';
    avvisi = $('#avvisi').html('').append('<strong>' + i18n['label.istruzioni.helpdesk.2'] + '</strong>');
    $('#intestazione').html('').append(i18n['label.istruzioni.reopen.helpdesk']).append('<br> <br>').append(avvisi);
  } else if (!common.User.isGuest) {
    nameForm = 'user_HelpDesk';
  }

  URL.Data.search.query({
    data: {
      q: 'select this.jconon_call:codice, this.cmis:objectId, this.jconon_call:descrizione' +
         ' from jconon_call:folder AS this ' +
         ' where this.jconon_call:data_fine_invio_domande >=  TIMESTAMP \'' + common.now + '\'' +
         ' and this.jconon_call:data_inizio_invio_domande <=  TIMESTAMP \'' + common.now + '\'' +
         ' order by this.jconon_call:codice ',
      maxItems : 1000
    },
    success: function (data) {
//mappo i risultati della query per i bandi
      var myData = $.map(data.items, function (el) {
        return {
          key: el['cmis:objectId'],
          value: el['cmis:objectId'],
          label: el['jconon_call:codice'] + ' | ' + el['jconon_call:descrizione'] + ' &nbsp',
          defaultLabel: el['jconon_call:codice'] + ' | ' + el['jconon_call:descrizione'] + ' &nbsp',
          property : "cmisCallId"
        };
      }),
        index,
        bulkinfo = new BulkInfo({
          target: helpDesk,
          path: 'helpdeskBulkInfo',
          name: nameForm,
          callback: {
            beforeCreateElement: function (item) {
              if (nameForm === 'helpDesk' || nameForm ===  'user_HelpDesk') {
                //post normale
                $('#helpdeskBulkInfo').attr('action', 'helpdesk').attr('method', 'POST').attr('enctype', 'multipart/form-data').append(inputFile).append(categoryHidden);
              } else {
                $('#helpdeskBulkInfo').append(btnReopen);
              }
//carico nel json del bulkinfo i risultati della queri mappati precedentemente e ripuliti
              if (item.name === 'cmisCallId') {
                for (index = 0; index < myData.length; index++) {
                  delete myData[index].allowableActions;
                }
                item.jsonlist = myData;
              }
            },
            afterCreateForm: function () {
              // riempio alcuni campi in casi di utente loggato
              if (!common.User.isGuest) {
                $('#firstName').val(common.User.firstName);
                $('#firstName').attr("readonly", "true");
                $('#lastName').val(common.User.lastName);
                $('#lastName').attr("readonly", "true");
                $('#email').val(common.User.email);
                $('#confirmEmail').val(common.User.email);
                $('#email').attr("readonly", "true");
              }
              //setto il value del bottone nascosto che mi serve per la category
              categoryHidden.attr('value', bulkinfo.getDataValueById('category'));
              $('#category').parents('.widget').off('setData').on('setData', function (event, key, value) {
                if (key === 'value') {
                  categoryHidden.attr('value', value);
                }
              });
              // nel caso di reopen faccio la post ajax
              $('#sendReopen').click(function () {
                var formData = new CNR.FormData(),
                  fd;
                $.each(bulkinfo.getData(), function (index, item) {
                  formData.data.append(item.name, item.value);
                });
                fd = formData.getData();
                fd.append('id', URL.querystring.from.id);
                fd.append('azione', URL.querystring.from.azione);
                if (bulkinfo.validate()) {
                  jconon.Data.helpdesk({
                    type: 'POST',
                    data: fd,
                    contentType: formData.contentType,
                    processData: false
                  }).done(function (data) {
                    $('#helpdesk2').remove();
                    $('#intestazione').html(data);
                  }).fail(function () {
                    UI.error(i18n['message.helpdesk.send.failed']);
                  });
                }
                return false;
              });
            }
          }
        });
      bulkinfo.render();
    }
  });
});