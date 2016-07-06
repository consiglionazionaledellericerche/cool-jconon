define(['jquery', 'header', 'cnr/cnr.bulkinfo', 'cnr/cnr', 'cnr/cnr.url', 'cnr/cnr.jconon', 'json!common', 'cnr/cnr.ui', 'i18n', 'json!cache', 'cnr/cnr.call', 'cnr/cnr.search'], function($, header, BulkInfo, CNR, URL, jconon, common, UI, i18n, cache, Call, Search) {
  "use strict";

  var bulkinfoReopen,
    bulkinfo,
    nameForm = 'helpDesk',
    helpDesk = $('#helpdesk2'),
    callTypes = [],
    ul = $('.cnraffix'),
    helpDeskBulkinfo = $('<div id="helpdesk"></div>'),
    inputFile = $('<div class="control-group form-horizontal"><label for="message" class="control-label">' + i18n['label.allega'] + '</label><div class="controls"> <input type="file" title="Search file to attach" name="allegato" /> </div> </div>'),
    btnSend = $('<div class="text-center"> <button id="send" name="send" class="btn btn-primary">' + i18n['button.send'] + '<i class="ui-button-icon-secondary ui-icon ui-icon-mail-open" ></i></button> </div>'),
    btnReopen = $('<div class="text-center"> <button id="sendReopen" class="btn btn-primary">' + i18n['button.send'] + '<i class="ui-button-icon-secondary ui-icon ui-icon-mail-open" ></i></button> </div>');


  function bulkinfoFunction() {
    bulkinfo = new BulkInfo({
      target: helpDeskBulkinfo,
      path: 'helpdeskBulkInfo',
      name: nameForm,
      callback: {
        beforeCreateElement: function(item) {
          if (item.name === 'call-type') {
            item.jsonlist = callTypes;
          }
        },
        afterCreateForm: function() {
          var ids = {};
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
          helpDesk.append(inputFile);
          helpDesk.append(btnSend);

          //aggiorno i bandi in base al callType
          $('#call-type').click(function() {
            if($('#call-type').val() !== ""){ 
            //rimuove i bando "vecchi" (della selezione precedente)
              $('#call').select2("val", undefined);
              $('#call').children().remove();
              $('#call').trigger('change');
              var close = UI.progress();
              URL.Data.search.query({
                queue: true,
                data: {
                  maxItems:500,
                  q: "SELECT cmis:name, jconon_call:codice, jconon_call:sede,jconon_call:id_categoria_normativa_helpdesk,jconon_call:id_categoria_tecnico_helpdesk FROM " + $('#call-type').val().substring(2) + " ORDER BY cmis:creationDate DESC "
                },
                complete: close
              }).success(function(data) {
                extractCall(data);
              });
            }
          });

          $('#send').click(ids, function() {
            sendFunction(ids);
          });


          function extractCall(data) {
            var option = '<option></option>';
            ids = data.items;
            ids.every(function(el, index) {
              option = option + '<option data-title="' + el['cmis:name'] + '" value="' + el['cmis:name'] + '">' + el['jconon_call:codice'] + ' - ' +  el['jconon_call:sede'] + '</option>';
              return true;
            });
            //in caso di selezione del tipo di bando, rimuovo le vecchie option
            $('#call option').remove();
            //...e carico le nuove option
            $('#call').append(option);
          }


          function sendFunction(ids) {
            var formData = new CNR.FormData(),
              nameCall = $('#call').val(),
              call,
              problemType = $('#problemType .active').data('value'),
              idCategory;

            if (bulkinfo.validate()) {
              $.each(bulkinfo.getData(), function(index, item) {
                //cmis:objectTypeId è il parametro sul "tipo" di bando e non viene passato
                if (item.name !== 'cmis:objectTypeId') {
                  formData.data.append(item.name, item.value);
                }
              });
              formData.data.append('allegato', $('input[type=file]')[0].files[0]);

              call = ids.filter(function(el) {
                return el['cmis:name'] === nameCall;
              })[0];

              if (problemType === 'Problema Tecnico') {
                idCategory = call['jconon_call:id_categoria_tecnico_helpdesk'] ? call['jconon_call:id_categoria_tecnico_helpdesk'] : 1;
              } else if (problemType === 'Problema Normativo') {
                idCategory = call['jconon_call:id_categoria_normativa_helpdesk'] ? call['jconon_call:id_categoria_normativa_helpdesk'] : 1;
              } else {
                UI.info('Occorre selezionare almeno un "Problema"');
                return false;
              }
              //setto l'id della categoria nel formData
              formData.data.append('category', idCategory);

              if (idCategory !== null && nameCall !== null) {
                jconon.Data.helpdesk.send({
                  type: 'POST',
                  data: formData.getData(),
                  contentType: formData.contentType,
                  processData: false,
                  success: function(data) {
                    //Scrivo il messaggio di successo in grassetto e raddoppio i </br>
                    helpDesk.remove();
                    $('#intestazione').html(i18n['message.helpdesk.send.success'].replace(/<\/br>/g, "</br></br>")).addClass('alert alert-success').css("font-weight", "Bold");
                  },
                  error: function(data) {
                    UI.error(i18n['message.helpdesk.send.failed']);
                  }
                });
              } else {
                if (idCategory === null) {
                  UI.info('Selezionare almeno un "Bando di riferimento"');
                }
              }
            }
            return false;
          }
        }
      }
    });
  }


  function loadPage() {
    bulkinfoFunction();
    bulkinfo.render();
    helpDesk.append(helpDeskBulkinfo);
  }


  $.each(cache.jsonlistCallType, function(index, el) {
    callTypes.push({
      "key": el.id,
      "label": el.id,
      "defaultLabel": el.title
    });
  });


  // helpdesk in caso di "reopen"
  if (URL.querystring.from.id && URL.querystring.from.azione) {
    bulkinfoReopen = new BulkInfo({
      target: helpDesk,
      path: 'helpdeskBulkInfo',
      name: 'reopen_HelpDesk',
      callback: {
        afterCreateForm: function() {
          $('#helpdeskBulkInfo').append(btnReopen);
          $('#sendReopen').click(function() {
            var formData = new CNR.FormData(),
              fd;
            $.each(bulkinfoReopen.getData(), function(index, el) {
              formData.data.append(el.name, el.value);
            });
            fd = formData.getData();
            fd.append('id', URL.querystring.from.id);
            fd.append('azione', URL.querystring.from.azione);
            if (bulkinfoReopen.validate()) {
              jconon.Data.helpdesk.send({
                type: 'POST',
                data: fd,
                contentType: formData.contentType,
                processData: false,
                success: function(data) {
                  UI.info(i18n['message.reopen.helpdesk.send.success'], function() {
                    window.location = URL.urls.root;
                  });
                },
                error: function() {
                  UI.error(i18n['message.reopen.helpdesk.send.failed'], function() {
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
    loadPage();
  }
});