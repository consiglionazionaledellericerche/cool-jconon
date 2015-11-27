require(['jquery', 'header', 'cnr/cnr', 'cnr/cnr.url', 'cnr/cnr.ui', 'json!cache', 'i18n', 'cnr/cnr.ui.select', 'cnr/cnr.application', 'cnr/cnr.jconon'], function ($, header, CNR, URL, UI, cache, i18n, select, Application, jconon) {
  "use strict";
  var mainSelect;
  function insertRigaTabella(id, oldLabel, newLabel) {

    var btnDelete, btnEdit, tr, identificativo, newLabelTd;

    btnDelete = $('<button class="btn btn-small btn-danger hover-btn" title="Cancella"><i class="icon-trash"/></button>');
    btnEdit = $('<button class="btn btn-small btn-primary hover-btn" title="Modifica"><i class="icon-edit"/></button>');
    newLabelTd = $('<td class="span11 pre-line"></td>');
    tr = $('<tr class="tr"></tr>').appendTo('#call-labels-table-data-body')
      .append($('<td class="span11"></td>').text(oldLabel))
      .append(newLabelTd.text(newLabel))
      .append($('<td class="span2"></td>').append(btnDelete).append(' ').append(btnEdit));
    
    btnEdit.click(function () {      
      var input = $('<textarea class="form-control" style="min-width: 90%"  rows="4"/>').val(newLabelTd.text());
      UI.bigmodal('Modifica etichetta', input, function () {
        jconon.Data.call.jsonLabels({
          type: 'POST',
          data: {
            'cmis:objectId' : params.callId,
            'key' : id,
            'newLabel' : input.val()
          },
          success: function (data) {
            newLabelTd.text(input.val());
          }
        });
      });
    });
    btnDelete.click(function () {
      UI.confirm(i18n['conferma-elimina-elemento'], function () {
        jconon.Data.call.jsonLabels({
          type: 'POST',
          data: {
            'cmis:objectId' : params.callId,
            'key' : id,
            'delete' : true
          },
          success: function (data) {
            tr.hide("slow");
          }
        });
      });
    });
  }
  $('#call-labels-button-add').click(function () {
    var key = mainSelect.data('value'), oldLabel = $('#type').data('value')[0],
      input = $('<textarea class="form-control" style="min-width: 90%"  rows="4"/>');
    input.val(oldLabel);
    UI.bigmodal('Modifica etichetta: ' + oldLabel, input, function () {
      jconon.Data.call.jsonLabels({
        type: 'POST',
        data: {
          'cmis:objectId' : params.callId,
          'key' : key,
          'oldLabel' : oldLabel,
          'newLabel' : input.val()
        },
        success: function (data) {
          insertRigaTabella(key, oldLabel, input.val());
        }
      });
    });
  });
  URL.Data.node.node({
    data: {
      nodeRef : params.callId
    },
    type: 'GET',
    success: function (data) {
      $('#type').append('<input type="hidden" id="typeTitle">');
      var item = {
        property : 'select2Type',
        class : 'input-xxlarge',
        ghostName : 'typeTitle',
        jsonlist : [{
          key : 'F:jconon_application:folder',
          label : 'Domanda'
        }].concat(
          Application.completeList(data['jconon_call:elenco_aspects'],cache.jsonlistApplicationAspects),
          Application.completeList(data['jconon_call:elenco_aspects_sezione_cnr'],cache.jsonlistApplicationAspects),
          Application.completeList(data['jconon_call:elenco_aspects_ulteriori_dati'],cache.jsonlistApplicationAspects),
          Application.completeList(data['jconon_call:elenco_association'],cache.jsonlistApplicationAttachments),
          Application.completeList(data['jconon_call:elenco_sezioni_curriculum'],cache.jsonlistApplicationCurriculums),
          Application.completeList(data['jconon_call:elenco_prodotti'],cache.jsonlistApplicationProdotti)
          )
      }, buttonMainEdit = $('<button class="btn btn-primary" disabled id="call-labels-button-add"><i class="icon-edit"></i> Modifica etichetta</button>').click(function () {
        var key = mainSelect.data('value'), oldLabel = $('#type').data('value')[0],
          input = $('<textarea class="form-control" style="min-width: 90%"  rows="4"/>');
        input.val(oldLabel);          
        UI.bigmodal('Modifica etichetta: ' + oldLabel, input, function () {
          jconon.Data.call.jsonLabels({
            type: 'POST',
            data: {
              'cmis:objectId' : params.callId,
              'key' : key,
              'oldLabel' : oldLabel,
              'newLabel' : input.val()
            },
            success: function (data) {
              insertRigaTabella(key, oldLabel, input.val());
            }
          });
        });
      }),buttonMainDettagli = $('<button class="btn btn-info" disabled id="call-labels-button-add"><i class="icon-list"></i> Dettagli</button>').click(function () {
        var key = mainSelect.data('value'), oldLabel = $('#type').data('value')[0], fields = [], itemField, fieldSelect,
          input = $('<textarea class="form-control" style="min-width: 90%"  rows="4" disabled/>'),
          modalField = $('<div class="control-group">'), 
          formName = key[0] === 'P' ? key : (key === 'F:jconon_application:folder' ? 'affix_tabAnagrafica,affix_tabResidenza,affix_tabReperibilita,affix_tabDichiarazioniConclusive' : 'default');
        URL.Data.bulkInfo({
          placeholder: {
            path: key,
            kind: 'form',
            name: formName
          },
          data: {
            guest: true
          },
          success : function (data) {
            $.each(data.forms, function (index, name) {
              $.each(data[name], function (index, el) {
                if (el.label || el.jsonlabel){
                  fields.push({
                    key : el.label ? el.label : el.jsonlabel.key,
                    label : el.label ? i18n[el.label] : i18n.prop(el.jsonlabel.key, el.jsonlabel.default)
                  });
                }
              });            
            });           
            itemField = {
              property : 'select2FieldType',
              class : 'input-xxlarge',
              ghostName : 'typeFieldTitle',
              jsonlist : fields
            };
            fieldSelect = select.Widget('select2FieldType', 'Etichetta', itemField);
            fieldSelect.find('.controls').append('<br/><br/><label class="control-label">Nuova Etichetta</label>').append(input);
            modalField.append('<input type="hidden" id="typeFieldTitle">');
            fieldSelect.find('.controls').parent().attr('style','min-width:100%');
            modalField.append(fieldSelect);
            fieldSelect.on('setData', function (event, key, value, initial) {
              if (key === 'value') {
                if (value) {
                  input.attr('disabled', null).removeClass('disabled');
                } else {
                  input.attr('disabled', 'disabled').addClass('disabled');
                }
              }
            });
            UI.bigmodal('Dettagli: ' + oldLabel, modalField, function () {
              var fieldOldLabel = $('#' + itemField.ghostName).parents('.control-group').data('value')[0];
              jconon.Data.call.jsonLabels({
                type: 'POST',
                data: {
                  'cmis:objectId' : params.callId,
                  'key' : fieldSelect.data('value'),
                  'oldLabel' : fieldOldLabel,
                  'newLabel' : input.val()
                },
                success: function (data) {
                  insertRigaTabella(key, fieldOldLabel, input.val());
                }
              });
            });
          }
        });
      });
      mainSelect = select.Widget('select2Type', 'Tipologia', item);
      mainSelect.appendTo($('#type'));
      mainSelect.find('.controls').append(' ').append(buttonMainEdit).append(' ').append(buttonMainDettagli);
      mainSelect.on('setData', function (event, key, value, initial) {
        if (key === 'value') {
          if (value) {
            mainSelect.find('.controls').find('button').attr('disabled', null).removeClass('disabled');
          } else {
            mainSelect.find('.controls').find('button').attr('disabled', 'disabled').addClass('disabled');
          }
        }
      });
      jconon.Data.call.jsonLabels({
        data: {
          'cmis:objectId' : params.callId
        },
        success: function (data) {
          $.each(data, function (index, el) {
            insertRigaTabella(index, el.oldLabel, el.newLabel);
          });
          $('#call-labels-table-data').animate({
            opacity : 1
            }, 400);          
          }
      });
    },
    error: function (jqXHR, textStatus, errorThrown) {
      CNR.log(jqXHR, textStatus, errorThrown);
    }
  });

});