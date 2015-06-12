/*global params*/
define(['jquery', 'header', 'i18n', 'cnr/cnr', 'cnr/cnr.ui', 'cnr/cnr.bulkinfo',
  'cnr/cnr.jconon', 'cnr/cnr.ace', 'cnr/cnr.url', 'cnr/cnr.call', 'cnr/cnr.attachments', 'json!cache', 'cnr/cnr.ui.widgets', 'cnr/cnr.ui.wysiwyg'
  ], function ($, header, i18n, CNR, UI, BulkInfo, jconon, ACE, URL, Call, Attachments, cache, Widgets, Wysiwyg) {
  "use strict";
  var ul = $('#affix'), content = $('#field'), forms = [], bulkinfo,
    toolbar = $('#toolbar-call'), jsonlistMacroCall = [], metadata = {},
    cmisObjectId = params['cmis:objectId'],
    query = 'select this.jconon_call:codice, this.cmis:objectId, this.jconon_call:descrizione' +
    ' from ' + jconon.findCallQueryName(params['call-type']) + ' AS this ' +
    ' JOIN jconon_call:aspect_macro_call AS macro ON this.cmis:objectId = macro.cmis:objectId ' +
    ' order by this.cmis:lastModificationDate DESC';

  Widgets['ui.wysiwyg'] = Wysiwyg;

  function createAttachments(affix) {
    return new Attachments({
      affix: affix,
      objectTypes: cache.jsonlistCallAttachments,
      cmisObjectId: cmisObjectId,
      search: {
        type: 'cmis:document',
        displayRow: jconon.defaultDisplayDocument
      }
    });
  }


  function changeActiveState(btn) {
    btn.parents('ul').find('.active').removeClass('active');
    btn.parent('li').addClass('active');
  }

  function showRdP(element) {
    element.find('table.table-striped').remove();
    Call.groupCommission(metadata['jconon_call:rdp'], element, function () {
      showRdP(element);
    });
  }

  function showCommission(element) {
    element.find('table.table-striped').remove();
    Call.groupCommission(metadata['jconon_call:commissione'], element, function () {
      showCommission(element);
    });
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
        showCommission($('#affix_sezione_commissione div.well'));
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

  $('#createChild').on("click", function () {
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
  function addPreviewButton(formItem, item) {
    var btnPreview = $('<button id="save" class="btn" type="button" title="preview"><i class="icon-picture"></i></button>').click(function (eventObject) {
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
          } else if (item.name === 'path_macro_call') {
            item.jsonlist = jsonlistMacroCall;
          }
        },
        afterCreateSection: function (section) {
          var div = section.find(':first-child'),
            showAllegati;
          div.addClass('well').append('<h1>' + i18n[section.attr('id')]
            + '</h1><hr></hr>');
          if (section.attr('id') === 'affix_sezione_allegati' && cmisObjectId) {
            showAllegati = createAttachments(div);
            showAllegati();
          } else if (section.attr('id') === 'affix_sezione_rdp' && cmisObjectId) {
            showRdP(div);
          } else if (section.attr('id') === 'affix_sezione_commissione' && cmisObjectId) {
            showCommission(div);
          }
        },
        afterCreateForm: function (form) {
          form.find("[id$='_en']").parents("div.control-group").hide();
          onChangeMacroCall(
            $('#aspect_macro_call > button.btn.active').attr('data-value')
          );
          manageClickMacroCall();
          $('body').scrollspy({ target: '.cnr-sidenav' });
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
        } else {
          bulkInfoRender();
        }
      }
    });
  }
  if (!params['call-type']) {
    UI.error('Valorizzare il tipo di Bando');
  } else {
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
  }
  $('button', toolbar).tooltip({
    placement: 'bottom',
    container: toolbar
  });
});