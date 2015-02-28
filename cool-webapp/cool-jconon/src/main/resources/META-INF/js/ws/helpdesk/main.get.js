define(['jquery', 'header', 'cnr/cnr.bulkinfo', 'cnr/cnr', 'cnr/cnr.url', 'cnr/cnr.jconon', 'json!common', 'cnr/cnr.ui', 'i18n'], function ($, header, BulkInfo, CNR, URL, jconon, common, UI, i18n) {
  "use strict";

  var nameForm = 'helpDesk',
    helpDesk = $('#helpdesk2'),
    helpDeskTop = $('<div id="helpdeskTop"></div>'),
    helpDeskDown = $('<div id="helpdeskDown"></div>'),
    inputFile = $('<div class="control-group form-horizontal"><label for="message" class="control-label">' + i18n['label.allega'] + '</label><div class="controls"> <input type="file" title="Search file to attach" name="allegato" /> </div> </div>'),
    idCategory = "2", //fix temporaneo
    bulkinfoTop,
    bulkinfoDown,
    bulkinfoReopen,
    nameCategory,
    btnSend = $('<div class="text-center"> <button id="send" name="send" class="btn btn-primary">' + i18n['button.send'] + '<i class="ui-button-icon-secondary ui-icon ui-icon-mail-open" ></i></button> </div>'),
    btnReopen = $('<div class="text-center"> <button id="sendReopen" class="btn btn-primary">' + i18n['button.send'] + '<i class="ui-button-icon-secondary ui-icon ui-icon-mail-open" ></i></button> </div>');

  function bulkinfoDownFunction(data) {
    var index, myData = $.map(data.items, function (el) {
      return {
        key: el['cmis:objectId'],
        value: el['cmis:objectId'],
        label: el['jconon_call:codice'] + ' | ' + el['jconon_call:descrizione'] + ' &nbsp',
        defaultLabel: el['jconon_call:codice'] + ' | ' + el['jconon_call:descrizione'] + ' &nbsp',
        property : "cmisCallId"
      };
    });

    bulkinfoDown = new BulkInfo({
      target: helpDeskDown,
      path: 'helpdeskBulkInfo',
      name: nameForm + "Down",
      callback: {
        beforeCreateElement: function (item) {
          //carico nel json del bulkinfo i risultati della query mappati precedentemente e ripuliti
          if (item.name === 'cmisCallId') {
            for (index = 0; index < myData.length; index++) {
              delete myData[index].allowableActions;
            }
            item.jsonlist = myData;
          }
        },
        afterCreateForm: function () {
          //inserisco il bottone di invio della segnalazione ed il widget che allega i file
          helpDeskDown.append(inputFile);
          helpDeskDown.append(btnSend);

          $('#send').click(function () {
            var formData = new CNR.FormData();
            //leggo i dati di entrambi i bulkinfo della pagina
            $.each(bulkinfoTop.getData(), function (index, item) {
              formData.data.append(item.name, item.value);
            });
            $.each(bulkinfoDown.getData(), function (index, item) {
              formData.data.append(item.name, item.value);
            });
            formData.data.append('allegato', $('input[type=file]')[0].files[0]);
            formData.data.append('category', idCategory);
            formData.data.append('descrizione', nameCategory);
            if (bulkinfoTop.validate() && bulkinfoDown.validate()) {
              jconon.Data.helpdesk({
                type: 'POST',
                data: formData.getData(),
                contentType: formData.contentType,
                processData: false,
                success: function (data) {
                  if (data.sendOk) {
                    //Scrivo il messaggio di successo in grassetto e raddoppio i </br>
                    helpDesk.remove();
                    $('#intestazione').html(i18n['message.helpdesk.send.success'].replace(/<\/br>/g, "</br></br>")).addClass('alert alert-success').css("font-weight", "Bold");
                  } else {
                    UI.error(i18n['message.helpdesk.send.failed']);
                  }
                },
                fail: function () {
                  UI.error(i18n['message.helpdesk.send.failed']);
                }
              });
            }
            return false;
          });
        }
      }
    });
  }


  function bulkinfoTopFunction(dynamicCategory) {
    bulkinfoTop = new BulkInfo({
      target: helpDeskTop,
      path: 'helpdeskBulkInfo',
      name: nameForm + "Top",
      callback: {
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
        }
      }
    });
  }

// helpdesk in caso di "reopen"
  if (URL.querystring.from.id && URL.querystring.from.azione) {
    bulkinfoReopen = new BulkInfo({
      target: helpDesk,
      path: 'helpdeskBulkInfo',
      name: 'reopen_HelpDesk',
      callback: {
        afterCreateForm: function () {
          $('#helpdeskBulkInfo').append(btnReopen);
          $('#sendReopen').click(function () {
            var formData = new CNR.FormData(),
              fd;
            $.each(bulkinfoReopen.getData(), function (index, item) {
              formData.data.append(item.name, item.value);
            });
            fd = formData.getData();
            fd.append('id', URL.querystring.from.id);
            fd.append('azione', URL.querystring.from.azione);
            if (bulkinfoReopen.validate()) {
              jconon.Data.helpdesk({
                type: 'POST',
                data: fd,
                contentType: formData.contentType,
                processData: false,
                success: function (data) {
                  if (data.reopenSendOk) {
                    UI.info(i18n['message.reopen.helpdesk.send.success'], function () {
                      window.location = URL.urls.root;
                    });
                  } else {
                    UI.error(i18n['message.reopen.helpdesk.send.failed']);
                  }
                },
                fail: function () {
                  UI.error(i18n['message.reopen.helpdesk.send.failed'], function () {
                    window.location = URL.urls.root;
                  });
                }
              });
            }
            return false;
          });
        }
      }
    });
    bulkinfoReopen.render();
  } else {
    if (!common.User.isGuest) {
      // se l'utente è loggato carico meno campi e alcuni campi vengono valorizzati
      nameForm = 'user_HelpDesk';
    }
  //carico dinamicamente il json con le category dei problemi
    URL.Data.search.content({
      data: {
        'path': '/Data Dictionary/Web Applications/jconon/WEB-INF/classes/problemiHelpdesk.json'
      },
      success: function (problemiHelpdesk) {
        //carico dinamicamente i bandi attivi
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
            //la pagina è divisa in 3 div (helpdeskTop, tree con le categorie dinamiche ed helpdeskDown)
            bulkinfoTopFunction(problemiHelpdesk.item);
            bulkinfoDownFunction(data);
            bulkinfoDown.render();
            bulkinfoTop.render();
            helpDesk.append(helpDeskTop);
            helpDesk.append(helpDeskDown);
          }
        });
      }
    });
  }
});