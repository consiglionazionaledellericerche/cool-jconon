/*global params*/
define(['jquery', 'header', 'i18n', 'cnr/cnr', 'cnr/cnr.ui', 'cnr/cnr.bulkinfo',
  'cnr/cnr.jconon', 'cnr/cnr.ace', 'cnr/cnr.url', 'cnr/cnr.call', 'cnr/cnr.attachments', 'json!cache', 'cnr/cnr.ui.widgets', 'cnr/cnr.ui.wysiwyg', 'cnr/cnr.ace', 'json!common'
  ], function ($, header, i18n, CNR, UI, BulkInfo, jconon, ACE, URL, Call, Attachments, cache, Widgets, Wysiwyg, Ace, common) {
  "use strict";
  var ul = $('#affix'), content = $('#field'), forms = [], bulkinfo,
    toolbar = $('#toolbar-call'), jsonlistMacroCall = [], metadata = {},
    cmisObjectId = params['cmis:objectId'],
    copyFrom = params['copyFrom'],
    query = 'select this.jconon_call:codice, this.cmis:objectId, this.jconon_call:descrizione' +
    ' from ' + jconon.findCallQueryName(params['call-type']) + ' AS this ' +
    ' JOIN jconon_call:aspect_macro_call AS macro ON this.cmis:objectId = macro.cmis:objectId ' +
    ' order by this.cmis:lastModificationDate DESC', copyEnabled = false;

  Widgets['ui.wysiwyg'] = Wysiwyg;
  $('#copy').prop('disabled', true);
  $.each(common.enableTypeCalls, function (key, elType) {
    if (elType.id === params['call-type']) {
      copyEnabled = true;
    }
  });
  if (cmisObjectId && copyEnabled) {
    $('#copy').prop('disabled', false).removeClass('disabled');
  }
  function createAttachments(affix) {
    return new Attachments({
      affix: affix,
      objectTypes: cache.jsonlistCallAttachments,
      cmisObjectId: cmisObjectId,
      forbidArchives: false,
      maxUploadSize: true,
      search: {
        type: 'jconon_attachment:document',
        displayRow: jconon.defaultDisplayDocument
      },
      submission : {
        callback : function (attachmentsData, data) {
          if (data['cmis:objectTypeId'] === 'D:jconon_attachment:call_convocazioni_candidati') {
            var startDate = moment(common.now),
              endDate = moment(common.now).add(moment.duration(1, 'month')),
              defaultFormat = 'YYYY-MM-DDTHH:mm:ss.SSSZ';
              URL.Data.frontOffice.doc({
                type: "POST",
                data: {
                  stackTrace: JSON.stringify({
                    "avvisi:number": Number(moment(common.now).format('YYYYMMDDHH')),
                    "avvisi:style": "information",
                    "avvisi:type":"Convocazione Bando " + metadata['jconon_call:codice'],
                    "avvisi:data": startDate.format(defaultFormat),
                    "avvisi:dataScadenza": endDate.format(defaultFormat),
                    "avvisi:title":"E' stata pubblicata la convocazione " + data['cmis:name'],
                    "avvisi:text":"<p>Per scaricare la convocazione cliccare <a href='rest/content?nodeRef=" + data['cmis:objectId'] + "'>qui</a></p>",
                    "avvisi:authority":"GROUP_EVERYONE"
                  }),
                  type_document: 'notice'
                },
                success: function (data) {
                  CNR.log(data);
                }
              });
          }
        }
      }
    });
  }


  function changeActiveState(btn) {
    btn.parents('ul').find('.active').removeClass('active');
    btn.parent('li').addClass('active');
  }

  function showRdP(element) {
    element.find('table.table-striped').remove();
    Call.displayGroup(metadata['jconon_call:rdp'], element, function () {
      showRdP(element);
    });
  }

  function showHelpDeskTecnico(element) {
    var idCategoriaTecnico = metadata['jconon_call:id_categoria_tecnico_helpdesk'];
    element.find('table.table-striped.categoria-' + idCategoriaTecnico).remove();
    if (idCategoriaTecnico) {
      Call.groupHelpDesk(idCategoriaTecnico, element, function () {
        showHelpDeskTecnico(element);
      });
    }
  }

  function showHelpDeskNormativo(element) {
    var idCategoriaNormativa = metadata['jconon_call:id_categoria_normativa_helpdesk'];
    element.find('table.table-striped.categoria-' + idCategoriaNormativa).remove();
    if (idCategoriaNormativa) {
      Call.groupHelpDesk(idCategoriaNormativa, element, function () {
        showHelpDeskNormativo(element);
      });
    }
  }

  function showCommission(element) {
    element.find('table.table-striped').remove();
    Call.displayGroup(metadata['jconon_call:commissione'], element, function () {
      showCommission(element);
    });
  }

  function showGestore() {
    var divGestore = $('#gestore'),
      gestore = metadata['cmis:createdBy'] || common.User.id,
      a = $('<a href="#undefined">' + gestore + '</a>').click(function () {
        Ace.showMetadata(gestore);
      });
    if (gestore) {
      divGestore.append('<i class="icon-user"></i> Gestore: ').append(a);
    }
  }

  $('#delete').click(function () {
    if (cmisObjectId) {
      Call.remove($('#codice').val(), cmisObjectId, params['call-type'], function () {
        window.location.href = jconon.URL.call.manage + '?call-type=' + params['call-type'];
      });
    }
  });

  $('#save').click(function () {
    bulkinfo.resetForm();
    var close = UI.progress();
    jconon.Data.call.main({
      type: 'POST',
      data: bulkinfo.getData(),
      success: function (data) {
        if (!cmisObjectId) {
          cmisObjectId = data['cmis:objectId'];
          bulkinfo.addFormItem('cmis:objectId', cmisObjectId);
          metadata = data;
          showRdP($('#affix_sezione_rdp div.well'));
          if (!Call.isActive(metadata['jconon_call:data_inizio_invio_domande'], metadata['jconon_call:data_fine_invio_domande'])) {
            showCommission($('#affix_sezione_commissione div.well'));            
          }
          var showAllegati = createAttachments($('#affix_sezione_allegati div.well'));
          showAllegati();
        }
        UI.success(i18n['message.operation.performed']);
      },
      complete: close,
      error: URL.errorFn
    });
  });
  $('#publish').click(function () {
    if (bulkinfo.validate()) {
      Call.publish(bulkinfo.getData(), $('#publish').find('i.icon-eye-open').length !== 0, function (published, removeClass, addClass, title, data) {
        showRdP($('#affix_sezione_rdp div.well'));
        if (!Call.isActive(metadata['jconon_call:data_inizio_invio_domande'], metadata['jconon_call:data_fine_invio_domande'])) {
          showCommission($('#affix_sezione_commissione div.well'));            
        }
        showHelpDeskTecnico($('#affix_sezione_helpdesk div.well div.HelpDeskTecnico'));
        showHelpDeskNormativo($('#affix_sezione_helpdesk div.well div.HelpDeskNormativo'));
        metadata['jconon_call:pubblicato'] = published;
        $('#publish').find('i').removeClass(removeClass).addClass(addClass);
        $('#publish').attr('title', title).tooltip('destroy').tooltip({placement: 'bottom'});
      });
    } else {
      UI.alert(i18n['message.improve.required.fields']);
    }
  });

  $('#close').click(function () {
    UI.confirm(i18n.prop('message.exit.without.saving'), function () {
      window.location.href = cache.redirectUrl;
    });
  });

  $('#showEnMetadata').click(function () {
    var fields = content.find("[id$='_en']").parents("div.control-group");
    if (!$(this).hasClass('active')) {
      fields.show();
    } else {
      fields.hide();
    }
  });
  $('#copy').on("click", function () {
    if ($('#copy').prop('disabled')) {
      return;
    }    
    window.location = jconon.URL.call.manage + '?call-type=' + params['call-type'] + '&copyFrom=' + cmisObjectId;
  });
  $('#createChild').on("click", function () {
    if ($('#createChild').prop('disabled')) {
      return;
    }
    var content = $('<div><div>').addClass('modal-inner-fix'),
      bulkinfoChild = new BulkInfo({
        target: content,
        formclass: 'form-horizontal',
        path: params['call-type'],
        name: 'create_child_call'
      });
    bulkinfoChild.render();
    UI.bigmodal(i18n['button.create.child'], content, function () {
      if (!bulkinfoChild.validate()) {
        return false;
      }
      var close = UI.progress(),
        data = bulkinfoChild.getData();
      data.push({name: 'cmis:parentId', value: cmisObjectId});
      data.push({name: 'cmis:objectTypeId', value: params['call-type']});
      jconon.Data.call.child({
        type: 'POST',
        data: data,
        success: function () {
          UI.success(i18n['message.operation.performed']);
        },
        complete: close,
        error: URL.errorFn
      });
      return false;
    });
  });

  function onChangeMacroCall(data) {
    var fieldsAdd = content.find("#numero_max_domande").parents("div.control-group"),
      fieldsRemove = content.find("#path_macro_call").parents("div.control-group");
    if (data === 'add-P:jconon_call:aspect_macro_call') {
      fieldsAdd.show();
      fieldsRemove.hide();
      $('#createChild').prop('disabled', false).removeClass('disabled');
    } else {
      fieldsAdd.hide();
      fieldsRemove.show();
      $('#createChild').prop('disabled', true);
    }
  }
  function manageClickMacroCall() {
    $('#aspect_macro_call > button.btn').on("click", function () {
      onChangeMacroCall($(this).attr('data-value'));
    });
  }
  function showPreviewAndLabelsButton(div) {
    div.append($('<div class="control-group">' + 
        '<label class="control-label">Anteprima Domanda</label>' +
        '<div class="controls"><a class="btn btn-primary" type="button" title="Anteprima domanda" href="manage-application?callId=' + cmisObjectId + '&preview=true">' + 
        '<i class="icon-picture"></i></a></div></div>'
      ));
    div.append($('<div class="control-group">' +
        '<label class="control-label">Configura etichette</label>' +
        '<div class="controls"><a class="btn btn-info" type="button" title="Configura etichette" href="manage-call-labels?callId=' + cmisObjectId + '">' +
        '<i class="icon-cog"></i></a></div></div>'));    
  }
  function addPreviewButton(formItem, item) {
    var btnPreview = $('<button class="btn" type="button" title="preview"><i class="icon-picture"></i></button>').click(function (eventObject) {
      var content = $('<div></div>').addClass('modal-inner-fix'),
        sections = ['preview'].concat(formItem.val()),
        bulkinfoPreview,
        charCodeAspect = 65;
      bulkinfoPreview =  new BulkInfo({
        target: content,
        formclass: 'form-horizontal jconon well',
        path: 'F:jconon_application:folder',
        metadata: bulkinfo.getDataJSON(),
        name: sections,
        callback: {
          afterCreateForm: function (form) {
            var rows = form.find('table tr');
            /*jslint unparam: true*/
            $.each(rows, function (index, el) {
              var td = $(el).find('td:last');
              if (td.find("[data-toggle=buttons-radio]").size() > 0) {
                td.find('label:first').addClass('span9').removeClass('control-label');
              }
            });
          },
          afterCreateSection: function (section) {
            var div = section.find(':first-child');
            if (section.attr('id').indexOf('preview') !== -1) {
              div.append($('<table></table>').addClass('table table-bordered'));
            } else {
              $('<tr></tr>')
                .append('<td>' + String.fromCharCode(charCodeAspect++) + '</td>')
                .append($('<td>').append(div))
                .appendTo(content.find("#preview > :last-child > :last-child"));
            }
          }
        }
      });
      bulkinfoPreview.render();
      UI.bigmodal('Preview', content);
    });
    formItem.element.find(".controls").
      append(btnPreview);
  }
  function bulkInfoRender() {
    if (metadata) {
      var pubblicato = metadata['jconon_call:pubblicato'],
        removeClass = pubblicato ? 'icon-eye-open' : 'icon-eye-close',
        addClass = pubblicato ? 'icon-eye-close' : 'icon-eye-open',
        title = pubblicato ? i18n['button.unpublish'] : i18n['button.publish'];
      $('#publish').find('i').removeClass(removeClass).addClass(addClass);
      $('#publish').attr('title', title).tooltip('destroy').tooltip({placement: 'bottom'});
      showGestore();
    }
    bulkinfo = new BulkInfo({
      target: content,
      formclass: 'form-horizontal jconon',
      path: params['call-type'],
      name: forms,
      metadata: metadata,
      callback: {
        beforeCreateElement: function (item) {
          if (item.name === 'elenco_aspects' ||
              item.name === 'elenco_aspects_sezione_cnr' ||
              item.name === 'elenco_aspects_ulteriori_dati') {
            item.jsonlist = cache.jsonlistApplicationAspects;
          } else if (item.name === 'elenco_association') {
            item.jsonlist = cache.jsonlistApplicationAttachments;
          } else if (item.name === 'elenco_field_not_required') {
            item.jsonlist = cache.jsonlistApplicationFieldsNotRequired;
          } else if (item.name === 'elenco_sezioni_domanda') {
            item.jsonlist = cache.jsonlistAffixApplication;
          } else if (item.name === 'elenco_sezioni_curriculum') {
            item.jsonlist = cache.jsonlistApplicationCurriculums;
          } else if (item.name === 'elenco_prodotti') {
            item.jsonlist = cache.jsonlistApplicationProdotti;
          } else if (item.name === 'elenco_schede_anonime') {
            item.jsonlist = cache.jsonlistApplicationSchedeAnonime;
          } else if (item.name === 'path_macro_call') {
            item.jsonlist = jsonlistMacroCall;
          }
        },
        afterCreateSection: function (section) {
          var div = section.find(':first-child'),
            showAllegati,
            divHelpDeskTecnico = $('<div class="HelpDeskTecnico thumbnail"><h4>Tecnico</h4></div>'),
            divHelpDeskNormativo = $('<div class="HelpDeskNormativo thumbnail"><h4>Normativo</h4></div>');
          div.addClass('well').append('<h1>' + i18n[section.attr('id')]
            + '</h1><hr></hr>');
          if (section.attr('id') === 'affix_sezione_allegati' && cmisObjectId) {
            showAllegati = createAttachments(div);
            showAllegati();
          } else if (section.attr('id') === 'affix_sezione_rdp' && cmisObjectId) {
            showRdP(div);
          } else if (section.attr('id') === 'affix_sezione_helpdesk' && cmisObjectId) {
            div.append(divHelpDeskTecnico);
            div.append('<BR>');
            div.append(divHelpDeskNormativo);
            showHelpDeskTecnico(divHelpDeskTecnico);
            showHelpDeskNormativo(divHelpDeskNormativo);
          } else if (section.attr('id') === 'affix_sezione_commissione' && cmisObjectId) {
            if (metadata['jconon_call:data_inizio_invio_domande'] && metadata['jconon_call:data_fine_invio_domande'] &&
              !Call.isActive(metadata['jconon_call:data_inizio_invio_domande'], metadata['jconon_call:data_fine_invio_domande'])) {
              showCommission(div);
            } else {
              section.hide();
              $('#affix').find('li a[href=\'#affix_sezione_commissione\']').parent().hide();
            }
          }
        },
        afterCreateForm: function (form) {
          form.find("[id$='_en']").parents("div.control-group").hide();
          onChangeMacroCall(
            $('#aspect_macro_call > button.btn.active').attr('data-value')
          );
          manageClickMacroCall();
          $('body').scrollspy({ target: '.cnr-sidenav' });
          if (cmisObjectId && (common.User.id === metadata['cmis:createdBy'] || common.User.isAdmin)) {
            showPreviewAndLabelsButton($('#affix_sezione_2 div.well'));
          }
          content.prepend($('<div class="well jumbotron"><h1>' + i18n.prop(params['call-type']) + '</h1></div>'));
        },
        afterCreateElement: function (formItem, item) {
          if (item.name === 'elenco_aspects' ||
              item.name === 'elenco_aspects_sezione_cnr' ||
              item.name === 'elenco_aspects_ulteriori_dati') {
            addPreviewButton(formItem, item);
          }
        }
      }
    });
    bulkinfo.render();
  }

  function render() {
    URL.Data.bulkInfoForms({
      placeholder: {
        prefix: 'affix',
        path: params['call-type'],
        kind: 'forms'
      },
      success: function (data) {
        $.each(data, function (index, el) {
          forms[index] = el;
          var li = $('<li></li>'),
            a = $('<a href="#' + el + '"><i class="icon-chevron-right"></i>' + i18n.prop(el, el) + '</a>').click(function (eventObject) {
              changeActiveState($(eventObject.target));
            });
          if (index === 0) {
            li.addClass('active');
          }
          li.append(a).appendTo(ul);
        });
        if (cmisObjectId) {
          URL.Data.node.node({
            data: {
              nodeRef : cmisObjectId
            },
            type: 'GET',
            success: function (data) {
              metadata = data;
              if (data['cmis:secondaryObjectTypeIds'].indexOf('P:jconon_call:aspect_macro_call') >= 0) {
                metadata['add-remove-aspect'] = 'add-P:jconon_call:aspect_macro_call';
              }
              bulkInfoRender();
            },
            error: function (jqXHR, textStatus, errorThrown) {
              CNR.log(jqXHR, textStatus, errorThrown);
            }
          });
        } else if (copyFrom) {
          URL.Data.node.node({
            data: {
              nodeRef : copyFrom
            },
            type: 'GET',
            success: function (data) {
              metadata = data;

              metadata['jconon_call:pubblicato'] = undefined;
              metadata['jconon_call:codice'] = undefined;
              metadata['cmis:createdBy'] = undefined;
              metadata['cmis:objectId'] = undefined;
              metadata['cmis:parentId'] = undefined;

              if (data['cmis:secondaryObjectTypeIds'].indexOf('P:jconon_call:aspect_macro_call') >= 0) {
                metadata['add-remove-aspect'] = 'add-P:jconon_call:aspect_macro_call';
              }
              bulkInfoRender();
            },
            error: function (jqXHR, textStatus, errorThrown) {
              CNR.log(jqXHR, textStatus, errorThrown);
            }
          });          
        } else {
          bulkInfoRender();
        }
      }
    });
  };
  function init() {
    URL.Data.search.query({
      queue: true,
      data: {
        q: query
      }
    }).done(function (rs) {
      $.map(rs.items, function (item) {
        jsonlistMacroCall.push({
          "key" : item['cmis:objectId'],
          "label" : item['jconon_call:codice'] + ' - ' + item['jconon_call:descrizione'],
          "defaultLabel" : item['jconon_call:codice'] + ' - ' + item['jconon_call:descrizione']
        });
      });
      render();
    }).fail(function (jqXHR, textStatus, errorThrown) {
      CNR.log(jqXHR, textStatus, errorThrown);
    });    
  };
  if (!params['call-type']) {
    UI.error('Valorizzare il tipo di Bando');
  } else {
    if (cmisObjectId) {
      var xhr = Call.loadLabels(cmisObjectId);
      xhr.done(function () {
        init();
      });
    } else {
      init();
    }
  }
  $('button', toolbar).tooltip({
    placement: 'bottom',
    container: toolbar
  });
});