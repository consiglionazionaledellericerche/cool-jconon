/*global params*/
define(['jquery', 'header', 'i18n', 'cnr/cnr.ui', 'cnr/cnr.bulkinfo', 'json!common', 'cnr/cnr.jconon', 'cnr/cnr.url',
  'cnr/cnr.application', 'cnr/cnr.attachments', 'json!cache', 'cnr/cnr.call', 'cnr/cnr', 'cnr/cnr.ui.widgets', 'cnr/cnr.ui.wysiwyg', 'cnr/cnr.ui.amministrazioni-ipa', 'cnr/cnr.ui.country',
  'cnr/cnr.ui.city'], function ($, header, i18n, UI, BulkInfo, common, jconon, URL, Application, Attachments, cache, Call, CNR, Widgets, Wysiwyg, AmministrazioniIpa) {
  "use strict";

  var content = $('#field'), bulkinfo, forms = [], aspects = [],
    cmisObjectId, metadata = {}, dataPeopleUser,
    callId = params.callId,
    callCodice = params.callCodice,
    toolbar = $('#toolbar-call'),
    charCodeAspect = 65,
    preview = params.preview,
    showTitoli, showCurriculum, showCurriculumUlteriore, showProdottiScelti, showProdotti, showSchedeAnonime,
    applicationAttachments, curriculumAttachments, curriculumAttachmentsUlteriore, prodottiAttachments, schedeAnonimeAttachments,
    buttonPeople  = $('<button type="button" class="btn btn-small"><i class="icon-folder-open"></i> ' + i18n['button.explorer.people'] + '</button>'),
    buttonPeopleScelti  = $('<button type="button" class="btn btn-small"><i class="icon-folder-open"></i> ' + i18n['button.explorer.people'] + '</button>'),
    refreshFnProdotti, refreshFnProdottiScelti,
    saved;

  Widgets['ui.wysiwyg'] = Wysiwyg;
  Widgets['ui.amministrazioni-ipa'] = AmministrazioniIpa;

  if (content.hasClass('error-allegati-empty')) {
    UI.alert(content.data('message') || i18n['message.error.allegati.empty'], null, null, true);
  }

  $('.cnr-sidenav').affix({
    offset: {
      top: 290,
      bottom: 270
    }
  });

  if (preview) {
    $('#send').prop('disabled', true);
  }

  function isSaved() {
    return saved || preview;
  }

  function setObjectValue(obj, value) {
    if (obj) {
      obj.val(value);
      if (obj.parents(".widget").size() > 0) {
        obj.trigger('change');
      } else {
        obj.trigger('blur');
      }
    }
  }

  function createTitoli(affix) {
    return new Attachments({
      isSaved: isSaved,
      affix: affix,
      objectTypes: applicationAttachments,
      cmisObjectId: cmisObjectId,
      search: {
        type: 'jconon_attachment:generic_document',
        displayRow: Application.displayTitoli,
        fetchCmisObject: true,
        calculateTotalNumItems: true,
        maxItems: 5,
        filter: false
      },
      submission: {
        externalData: [
          {
            name: 'aspect',
            value: 'P:jconon_attachment:generic_document'
          },
          {
            name: 'jconon_attachment:user',
            value: dataPeopleUser.userName
          }
        ]
      }
    });
  }

  function createProdottiScelti(affix, isMoveable) {
    return new Attachments({
      isSaved: isSaved,
      affix: affix,
      objectTypes: prodottiAttachments,
      cmisObjectId: cmisObjectId,
      search: {
        type: 'cvpeople:commonMetadata',
        join: 'cvpeople:selectedProduct',
        filter: false,
        fetchCmisObject: true,
        isAspect: true,
        includeAspectOnQuery: true,
        calculateTotalNumItems: true,
        label: 'label.count.no.prodotti',
        displayRow: function (el, refreshFn) {
          refreshFnProdottiScelti = refreshFn;
          return Application.displayProdottiScelti(el, refreshFn, undefined, refreshFnProdotti, isMoveable);
        },
        displayAfter: function (documents, refreshFn, resultSet, isFilter) {
          if (!isFilter) {
            affix.find('sub.total').remove();
            affix.find('h1').after('<sub class="total pull-right">' + i18n.prop('label.prodotti.visualizzati', documents.totalNumItems) + '</sub>');
          }
        },
        maxItems: 5,
        mapping: function (mapping) {
          mapping.parentId = cmisObjectId;
          return mapping;
        }
      },
      submission: {
        externalData: [
          {
            name: 'aspect',
            value: 'P:cvpeople:selectedProduct'
          },
          {
            name: 'jconon_attachment:user',
            value: dataPeopleUser.userName
          }
        ],
        multiple: false,
        bigmodal: false
      },
      otherButtons: common['people.product.enable'] ? [
        {
          button : buttonPeopleScelti,
          add : function (type, cmisObjectId, refreshFn) {
            Application.people(type, cmisObjectId, 'P:cvpeople:selectedProduct', refreshFn, dataPeopleUser);
          }
        }
      ] : []
    });
  }

  function createProdotti(affix, isMoveable) {
    return new Attachments({
      isSaved: isSaved,
      affix: affix,
      objectTypes: prodottiAttachments,
      cmisObjectId: cmisObjectId,
      search: {
        type: 'cvpeople:commonMetadata',
        join: 'cvpeople:noSelectedProduct',
        isAspect: true,
        displayRow: function (el, refreshFn) {
          refreshFnProdotti = refreshFn;
          return Application.displayProdotti(el, refreshFn, refreshFnProdottiScelti, isMoveable);
        },
        displayAfter: function (documents, refreshFn, resultSet, isFilter) {
          if (!isFilter) {
            affix.find('sub.total').remove();
            affix.find('h1').after('<sub class="total pull-right">' + i18n.prop('label.prodotti.visualizzati', documents.totalNumItems) + '</sub>');
          }
        },
        maxItems: 5,
        filter: true,
        includeAspectOnQuery: true,
        calculateTotalNumItems: true,
        label: 'label.count.no.prodotti',
        mapping: function (mapping) {
          mapping.parentId = cmisObjectId;
          return mapping;
        }
      },
      submission: {
        externalData: [
          {
            name: 'aspect',
            value: 'P:cvpeople:noSelectedProduct'
          },
          {
            name: 'jconon_attachment:user',
            value: dataPeopleUser.userName
          }
        ],
        requiresFile: false,
        showFile: false,
        bigmodal: true
      },
      otherButtons: common['people.product.enable']?[{
        button : buttonPeople,
        add : function (type, cmisObjectId, refreshFn) {
          Application.people(type, cmisObjectId, 'P:cvpeople:noSelectedProduct', refreshFn, dataPeopleUser);
        }
      }]:[]
    });
  }

  function createCurriculum(affix) {
    return new Attachments({
      isSaved: isSaved,
      affix: affix,
      objectTypes: curriculumAttachments,
      cmisObjectId: cmisObjectId,
      search: {
        type: 'jconon_attachment:cv_element',
        join: 'cvelement:curriculum',
        isAspect: true,
        displayRow: function (el, refreshFn) {
          return Application.displayCurriculum(el, refreshFn, undefined, 'P:cvelement:curriculum', 'jconon_call:elenco_sezioni_curriculum');
        },
        displayAfter: function (documents, refreshFn, resultSet, isFilter) {
          if (!isFilter) {
            affix.find('sub.total').remove();
            affix.find('h1').after('<sub class="total pull-right">' + i18n.prop('label.righe.visualizzate', documents.totalNumItems) + '</sub>');
          }
        },
        fetchCmisObject: true,
        maxItems: 5,
        filter: false,
        filterOnType: true,
        includeAspectOnQuery: true,
        calculateTotalNumItems: true,
        label: 'label.count.no.curriculum',
        mapping: function (mapping) {
          mapping.parentId = cmisObjectId;
          mapping['jconon_call:elenco_sezioni_curriculum'] = metadata['jconon_call:elenco_sezioni_curriculum'];
          return mapping;
        }
      },
      buttonUploadLabel: 'Aggiungi riga',
      submission: {
        requiresFile: false,
        showFile: false,
        bigmodal: true,
        externalData: [
          {
            name: 'aspect',
            value: 'P:cvelement:curriculum'
          },
          {
            name: 'jconon_attachment:user',
            value: dataPeopleUser.userName
          }
        ]
      }
    });
  }

  function createCurriculumUlteriore(affix) {
    return new Attachments({
      isSaved: isSaved,
      affix: affix,
      objectTypes: curriculumAttachmentsUlteriore,
      cmisObjectId: cmisObjectId,
      search: {
        type: 'jconon_attachment:cv_element',
        join: 'cvelement:other_curriculum',
        isAspect: true,
        displayRow: function (el, refreshFn) {
          return Application.displayCurriculum(el, refreshFn, undefined, 'P:cvelement:other_curriculum', 'jconon_call:elenco_sezioni_curriculum_ulteriore');
        },
        displayAfter: function (documents, refreshFn, resultSet, isFilter) {
          if (!isFilter) {
            affix.find('sub.total').remove();
            affix.find('h1').after('<sub class="total pull-right">' + i18n.prop('label.righe.visualizzate', documents.totalNumItems) + '</sub>');
          }
        },
        fetchCmisObject: true,
        maxItems: 5,
        filter: true,
        filterOnType: true,
        includeAspectOnQuery: true,
        calculateTotalNumItems: true,
        label: 'label.count.no.curriculum',
        mapping: function (mapping) {
          mapping.parentId = cmisObjectId;
          mapping['jconon_call:elenco_sezioni_curriculum_ulteriore'] = metadata['jconon_call:elenco_sezioni_curriculum_ulteriore'];
          return mapping;
        }
      },
      buttonUploadLabel: 'Aggiungi riga',
      submission: {
        requiresFile: false,
        showFile: false,
        bigmodal: true,
        externalData: [
         {
            name: 'aspect',
            value: 'P:cvelement:other_curriculum'
         },
         {
            name: 'jconon_attachment:user',
            value: dataPeopleUser.userName
         }
        ]
      }
    });
  }

  function createSchedeAnonime(affix) {
    return new Attachments({
      isSaved: isSaved,
      affix: affix,
      objectTypes: schedeAnonimeAttachments,
      cmisObjectId: cmisObjectId,
      search: {
        type: 'jconon_scheda_anonima:document',
        displayRow: Application.displaySchedaAnonima,
        displayAfter: function (documents, refreshFn, resultSet, isFilter) {
          if (!isFilter) {
            affix.find('sub.total').remove();
            affix.find('h1').after('<sub class="total pull-right">' + i18n.prop('label.righe.visualizzate', documents.totalNumItems) + '</sub>');
          }
        },
        fetchCmisObject: true,
        maxItems: 5,
        filter: true,
        filterOnType: true,
        includeAspectOnQuery: true,
        calculateTotalNumItems: true,
        label: 'label.count.no.curriculum',
        mapping: function (mapping) {
          mapping.parentId = cmisObjectId;
          mapping['jconon_call:elenco_schede_anonime'] = metadata['jconon_call:elenco_schede_anonime'];
          return mapping;
        }
      },
      buttonUploadLabel: 'Aggiungi riga',
      submission: {
        requiresFile: false,
        showFile: false,
        bigmodal: true,
        externalData: [
          {
            name: 'jconon_attachment:user',
            value: dataPeopleUser.userName
          }
        ]
      }
    });
  }

  function manageIntestazione(call, application) {
    var descRid = null,
      callDescrizioneRidotta = call["jconon_call:descrizione_ridotta"] !== null ? call["jconon_call:descrizione_ridotta"] : '',
      existApplication = application && application["jconon_application:stato_domanda"] !== 'I',
      isTemp = existApplication && application["jconon_application:stato_domanda"] === 'P',
      lastName = application && application["jconon_application:cognome"] !== undefined ? application["jconon_application:cognome"] : dataPeopleUser.lastName,
      firstName = application && application["jconon_application:nome"] !== undefined ? application["jconon_application:nome"] : dataPeopleUser.firstName,
      divLabelStato = $('<div></div>')
        .addClass("alert")
        .addClass(isTemp ? 'alert-error' : 'alert-success')
        .append(isTemp ? i18n['application.status.provvisoria'] : i18n['application.status.definitiva']);
    if (call["cmis:objectTypeId"] === 'F:jconon_call_mobility_open:folder') {
      $('#application-title').hide();
    } else if (call["cmis:objectTypeId"] === 'F:jconon_call_mobility:folder') {
      $('#application-title').append(i18n['application.title.mobility']);
    } else {
      $('#application-title').append(i18n['application.title']);
    }

    $('#call-codice')
      .prepend(i18n['label.jconon_bando_selezione'] + ' ' + call["jconon_call:codice"])
      .on('click', 'button', function () {
        Call.displayAttachments(callId);
      });
    $('#call-desc').append(call["jconon_call:descrizione"]).append(existApplication ? divLabelStato : null);
    if (call["jconon_call:sede"] && call["jconon_call:sede"].length) {
      descRid = (descRid !== null ? descRid + '</br>' : '') + call["jconon_call:sede"];
    } else if (call["jconon_call:elenco_settori_tecnologici"] && call["jconon_call:elenco_settori_tecnologici"].length) {
      /*jslint unparam: true*/
      $.each(call["jconon_call:elenco_settori_tecnologici"], function (index, el) {
        descRid = (descRid !== null ? descRid + ' - ' + el : i18n['label.th.jconon_bando_elenco_settori_tecnologici'] + ': ' + el);
      });
      /*jslint unparam: false*/
    } else if (call["jconon_call:elenco_macroaree"] && call["jconon_call:elenco_macroaree"].length) {
      /*jslint unparam: true*/
      $.each(call["jconon_call:elenco_macroaree"], function (index, el) {
        descRid = (descRid !== null ? descRid + ' - ' + el : i18n['label.th.jconon_bando_elenco_macroaree'] + ': ' + el);
      });
      /*jslint unparam: false*/
    }
    $('#call-desc-rid').append(callDescrizioneRidotta + (descRid !== null ? descRid : ""));
    $('#appl-rich').append(i18n['application.text.sottoscritto.' + (application['jconon_application:sesso'] ? application['jconon_application:sesso'] : 'M')] + ' ' + lastName + ' ' + firstName + '</br>' +
      (call['cmis:objectTypeId'] === 'F:jconon_call_employees:folder' && dataPeopleUser.matricola ? i18n['cm.matricola'] + ': ' + dataPeopleUser.matricola + ' - ' + i18n['cm.email'] + ': ' + dataPeopleUser.email + '</br>' : '') +
      (call['cmis:objectTypeId'] === 'F:jconon_call_mobility_open:folder' ? '' : i18n['application.text.chiede.partecipare.predetta.procedura']));
  }

  function changeActiveState(btn) {
    btn.parents('ul').find('.active').removeClass('active');
    btn.parent('li').addClass('active');
  }

  function manageNazioni(value, fieldsItaly, fieldsForeign) {
    if (value && value.toUpperCase() === 'ITALIA') {
      fieldsForeign.val('').trigger('blur');
      fieldsItaly.parents(".control-group").show();
      fieldsForeign.parents(".control-group").hide();
    } else {
      fieldsItaly.val('').trigger('change');
      fieldsItaly.parents(".control-group").hide();
      fieldsForeign.parents(".control-group").show();
    }
  }

  function manageNazioneNascita(value) {
    var fieldsItaly = content.find("#comune_nascita"),
      fieldsForeign = content.find("#comune_nascita_estero");
    manageNazioni(value, fieldsItaly, fieldsForeign);
  }

  function manageNazioneResidenza(value) {
    var fieldsItaly = content.find("#comune_residenza"),
      fieldsForeign = content.find("#comune_residenza_estero");
    manageNazioni(value, fieldsItaly, fieldsForeign);
  }

  function manageNazioneComunicazioni(value) {
    var fieldsItaly = content.find("#comune_comunicazioni"),
      fieldsForeign = content.find("#comune_comunicazioni_estero");
    manageNazioni(value, fieldsItaly, fieldsForeign);
  }

  function tabAnagraficaFunction() {
    /*jslint unparam: true*/
    $('#nazione_nascita').parents('.widget').bind('changeData', function (event, key, value) {
      if (key === 'value') {
        manageNazioneNascita(value);
      }
    });
    /*jslint unparam: false*/
    manageNazioneNascita($("#nazione_nascita").attr('value'));
  }

  function tabResidenzaFunction() {
    /*jslint unparam: true*/
    $('#nazione_residenza').parents('.widget').bind('changeData', function (event, key, value) {
      if (key === 'value') {
        manageNazioneResidenza(value);
      }
    });
    /*jslint unparam: false*/
    manageNazioneResidenza($("#nazione_residenza").attr('value'));
  }

  function tabReperibilitaFunction(residenza) {
    /*jslint unparam: true*/
    $('#nazione_comunicazioni').parents('.widget').bind('changeData', function (event, key, value) {
      if (key === 'value') {
        manageNazioneComunicazioni(value);
      }
    });
    /*jslint unparam: false*/
    manageNazioneComunicazioni($("#nazione_comunicazioni").attr('value'));
    if (residenza == 0) {
        $('#copyFromTabResidenza').toggle();
    } else {
        $('#copyFromTabResidenza').click(function () {
          UI.confirm(i18n.prop('message.copy.residenza'), function () {
            var nazioneVal = content.find("#nazione_residenza").val();
            setObjectValue(content.find("#nazione_comunicazioni"), nazioneVal);
            if (nazioneVal.toUpperCase() === 'ITALIA') {
              setObjectValue(content.find("#comune_comunicazioni"), content.find("#comune_residenza").val());
            } else {
              setObjectValue(content.find("#comune_comunicazioni_estero"), content.find("#comune_residenza_estero").val());
            }
            setObjectValue(content.find("#cap_comunicazioni"), content.find("#cap_residenza").val());
            setObjectValue(content.find("#indirizzo_comunicazioni"), content.find("#indirizzo_residenza").val());
            setObjectValue(content.find("#num_civico_comunicazioni"), content.find("#num_civico_residenza").val());
            manageNazioneComunicazioni(nazioneVal);
          });
        });
    }
  }

  function requiredPEC(value) {
    var emailPec = $("#email_pec_comunicazioni");
    if (emailPec.length > 0) {
        if (metadata["jconon_call:print_trattamento_dati_personali"] || metadata["jconon_call:print_dic_sost"]) {
            emailPec.rules(String(value) === 'false'? 'remove': 'add', 'required');
        }
    }
  }

  function bulkInfoRender(call) {
    cmisObjectId = metadata['cmis:objectId'];
    bulkinfo =  new BulkInfo({
      target: content,
      formclass: 'form-horizontal jconon',
      path: 'F:jconon_application:folder',
      name: forms,
      metadata: metadata,
      callback: {
        beforeCreateElement: function (item) {
          if (item.name === 'elenco_lingue_conosciute') {
            var jsonlistLingueConosciute = [];
            if (call["jconon_call:elenco_lingue_da_conoscere"]) {
              $.each(call["jconon_call:elenco_lingue_da_conoscere"], function (index, el) {
                jsonlistLingueConosciute.push({
                  "key" : el,
                  "label" : el,
                  "defaultLabel" : el
                });
              });
              item.jsonlist = jsonlistLingueConosciute;
            }
          }
        },
        afterCreateForm: function (form) {
          var labelKey = 'text.jconon_application_dichiarazione_sanzioni_penali_' + call['jconon_call:codice'],
            labelSottoscritto = i18n['application.text.sottoscritto.lower.' + (metadata['jconon_application:sesso'] ? metadata['jconon_application:sesso'] : 'M')],
            labelValue = i18n.prop(labelKey, labelSottoscritto);
          formatDichiarazioni(form.find('#affix_tabDichiarazioni table tr'));
          formatDichiarazioni(form.find('#affix_tabDatiCNR table tr'));
          formatDichiarazioni(form.find('#affix_tabUlterioriDati table tr'));
          formatDichiarazioni(form.find('#affix_tabSezione4 table tr'));
          formatDichiarazioni(form.find('#affix_tabSezione5 table tr'));
          requiredPEC(metadata['jconon_application:fl_cittadino_italiano']);
          $('#fl_cittadino_italiano button').click(function() {
              requiredPEC($(this).attr('data-value'));
          });

          /*jslint unparam: false*/
          form.find('#affix_tabDichiarazioniConclusive label').addClass('span10').removeClass('control-label');
          form.find('#affix_tabDichiarazioniConclusive .controls').addClass('span2');
          if (labelValue === labelSottoscritto) {
            labelValue = i18n.prop('text.jconon_application_dichiarazione_sanzioni_penali', labelSottoscritto);
          }
          $('#fl_dichiarazione_sanzioni_penali').parents('div.widget').children('label').text(labelValue);
          $('#fl_dichiarazione_dati_personali').parents('div.widget').children('label').html(i18n.prop('text.jconon_application_dichiarazione_dati_personali', labelSottoscritto, metadata['cmis:objectId']));
          if (call["jconon_call:elenco_field_not_required"]) {
              $.each(call["jconon_call:elenco_field_not_required"], function (index, el) {
                var input = form.find("input[name='" + el + "']"),
                  widget = form.find("#" + el.substr(el.indexOf(':') + 1)).parents('.widget');
                if (input.length !== 0) {
                  input.rules('remove', 'required');
                }
                if (widget.length !== 0) {
                  widget.rules('remove', 'requiredWidget');
                }
              });
          }
          tabAnagraficaFunction();
          tabResidenzaFunction();
          tabReperibilitaFunction(form.find('#affix_tabResidenza').length);
          $('select').trigger('change');
          $('.popover-info').popover({container: 'body', trigger:'click'});
        },
        afterCreateSection: function (section) {
          var div = section.find(':first-child'),
            jsonlistApplicationNoAspects = (metadata['jconon_application:fl_cittadino_italiano'] ? cache.jsonlistApplicationNoAspectsItalian : cache.jsonlistApplicationNoAspectsForeign),
            loadAspect;
          if (section.attr('id').indexOf('affix') !== -1) {
            div.addClass('well').append('<h1>' + i18n[section.attr('id')] + '</h1><hr></hr>');
            if (section.attr('id') === 'affix_tabDichiarazioni' ||
                section.attr('id') === 'affix_tabDatiCNR' ||
                section.attr('id') === 'affix_tabUlterioriDati'||
                section.attr('id') === 'affix_tabSezione4' ||
                section.attr('id') === 'affix_tabSezione5') {
              div.append($('<table></table>').addClass('table table-bordered'));
            } else if (section.attr('id') === 'affix_tabTitoli' && cmisObjectId) {
              showTitoli = createTitoli(div);
              showTitoli();
            } else if (section.attr('id') === 'affix_tabCurriculum' && cmisObjectId) {
              showCurriculum = createCurriculum(div);
              showCurriculum();
            } else if (section.attr('id') === 'affix_tabCurriculum_ulteriore' && cmisObjectId) {
              showCurriculumUlteriore = createCurriculumUlteriore(div);
              showCurriculumUlteriore();
            } else if (section.attr('id') === 'affix_tabProdottiScelti' && cmisObjectId) {
              showProdottiScelti = createProdottiScelti(div, call["jconon_call:elenco_sezioni_domanda"].indexOf('affix_tabElencoProdotti') !== -1);
              showProdottiScelti();
            } else if (section.attr('id') === 'affix_tabElencoProdotti' && cmisObjectId) {
              showProdotti = createProdotti(div, call["jconon_call:elenco_sezioni_domanda"].indexOf('affix_tabProdottiScelti') !== -1);
              showProdotti();
            } else if (section.attr('id') === 'affix_tabSchedaAnonima' && cmisObjectId) {
              showSchedeAnonime = createSchedeAnonime(div);
              showSchedeAnonime();
            }
          } else {
            loadAspect = true;
            /*jslint unparam: true*/
            $.each(jsonlistApplicationNoAspects, function (index, el) {
              if (el.key === section.attr('id')) {
                loadAspect = false;
              }
            });
            /*jslint unparam: false*/
            if (loadAspect) {
              if ((metadata['jconon_application:fl_cittadino_italiano'] && cache.jsonlistApplicationNoAspectsItalian.indexOf(section.attr('id')) === -1) ||
                  !(metadata['jconon_application:fl_cittadino_italiano'] && cache.jsonlistApplicationNoAspectsForeign.indexOf(section.attr('id')) === -1)) {
                if (call["jconon_call:elenco_aspects"] && call["jconon_call:elenco_aspects"].indexOf(section.attr('id')) !== -1) {
                    $('<tr></tr>')
                      .append('<td>' + String.fromCharCode(charCodeAspect++) + '</td>')
                      .append($('<td>').append(div))
                      .appendTo(content.find("#affix_tabDichiarazioni > :last-child > :last-child"));
                } else if (call["jconon_call:elenco_aspects_sezione_cnr"] && call["jconon_call:elenco_aspects_sezione_cnr"].indexOf(section.attr('id')) !== -1) {
                    $('<tr></tr>')
                      .append($('<td>').append(div))
                      .appendTo(content.find("#affix_tabDatiCNR > :last-child > :last-child"));
                } else if (call["jconon_call:elenco_aspects_ulteriori_dati"] && call["jconon_call:elenco_aspects_ulteriori_dati"].indexOf(section.attr('id')) !== -1) {
                    $('<tr></tr>')
                      .append($('<td>').append(div))
                      .appendTo(content.find("#affix_tabUlterioriDati > :last-child > :last-child"));
                } else if (call["jconon_call:elenco_aspects_sezione_4"] && call["jconon_call:elenco_aspects_sezione_4"].indexOf(section.attr('id')) !== -1) {
                    $('<tr></tr>')
                      .append($('<td>').append(div))
                      .appendTo(content.find("#affix_tabSezione4 > :last-child > :last-child"));
                } else if (call["jconon_call:elenco_aspects_sezione_5"] && call["jconon_call:elenco_aspects_sezione_5"].indexOf(section.attr('id')) !== -1) {
                    $('<tr></tr>')
                      .append($('<td>').append(div))
                      .appendTo(content.find("#affix_tabSezione5 > :last-child > :last-child"));
                }
              }
            }
            section.hide();
          }
        }
      }
    });
    bulkinfo.render();
    bulkinfo.addFormItem('cmis:parentId', callId);
    /*jslint unparam: true*/
    $.each(aspects, function (index, el) {
      if (el && el !== null) {
        bulkinfo.addFormItem('aspect', el);
      }
    });
    /*jslint unparam: false*/
    bulkinfo.addFormItem('cmis:objectId', metadata['cmis:objectId']);
  }

  function formatDichiarazioni(rows) {
      $.each(rows, function (index, el) {
        var td = $(el).find('td:last');
        if (td.find("[data-toggle=buttons-radio]").size() > 0) {
          td.find('label:first').addClass('span10').removeClass('control-label');
          td.find('.controls:first').addClass('span2');
        } else {
          if (td.find('input:first').hasClass('span12') || td.find('textarea:first').hasClass('span12') || td.find('select').hasClass('span12')) {
            td.find('label:first').removeClass('control-label');
            td.find('.control-group').addClass('span12').addClass('d-inline-grid');
            td.find('.controls').removeClass('controls');
          }
        }
      });
  }

  function render(call, application) {
    var ul = $('.cnraffix'),
      print_dic_sost = $('<button class="btn btn-info" type="button"><i class="icon-print"></i> ' + i18n['label.print.dic.sost'] + '</button>').on('click', function () {
        window.location = jconon.URL.application.print_dic_sost + '?applicationId=' + cmisObjectId;
      }),
      print_trattamento_dati_personali = $('<button class="btn btn-primary" type="button"><i class="icon-print"></i> ' + i18n.prop('label.print.trattamento.dati.personali', cmisObjectId) + '</button>').on('click', function () {
        window.location = jconon.URL.application.print_trattamento_dati_personali + '?applicationId=' + cmisObjectId;
      }),
      print_avviso_pagopa = $('<button class="btn btn-danger span6" type="button"><i class="icon-print"></i> ' + i18n.prop('label.print.avviso.pagopa', cmisObjectId) + '</button>').on('click', function () {
        var close = UI.progress();
        jconon.Data.application.print_avviso_pagopa({
            type: 'GET',
            placeholder: {
              'applicationId' : cmisObjectId
            },
            success: function (data) {
                window.location = jconon.URL.application.download_avviso_pagopa + '?applicationId=' + cmisObjectId;
            },
            complete: close,
            error: URL.errorFn
        });
      }),
      paga_avviso_pagopa = $('<button class="btn btn-primary span6" type="button"><i class="icon-share-alt"></i> ' + i18n.prop('label.paga.avviso.pagopa', cmisObjectId) + '</button>').on('click', function () {
        var close = UI.progress();
        jconon.Data.application.paga_avviso_pagopa({
            type: 'GET',
            placeholder: {
              'applicationId' : cmisObjectId
            },
            success: function (data) {
              window.location = data.redirect;
            },
            complete: close,
            error: URL.errorFn
        });
      }),
      toolbar_pagopa = $('<div class="inline-block btn-block">');
    $.each(call["jconon_call:elenco_sezioni_domanda"], function (index, el) {
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
    if (call["jconon_call:print_dic_sost"]) {
      $('.cnr-sidenav')
        .append('<br/>')
        .append(print_dic_sost);
    }
    if (call["jconon_call:print_trattamento_dati_personali"]) {
      $('.cnr-sidenav')
        .append('<br/><br/>')
        .append(print_trattamento_dati_personali);
    }
    if (call["jconon_call:pagamento_pagopa"]) {
      $('.cnr-sidenav')
        .append('<br/><br/>')
        .append(toolbar_pagopa);
      toolbar_pagopa
        .append(print_avviso_pagopa)
        .append(paga_avviso_pagopa);
    }
    aspects = []
      .concat(call["jconon_call:elenco_aspects"])
      .concat(call["jconon_call:elenco_aspects_sezione_cnr"])
      .concat(call["jconon_call:elenco_aspects_ulteriori_dati"])
      .concat(call["jconon_call:elenco_aspects_sezione_4"])
      .concat(call["jconon_call:elenco_aspects_sezione_5"]);
    /*jslint unparam: true*/
    $.each(aspects, function (index, el) {
      if (el && el !== null) {
        forms[forms.length] = el;
      }
    });
    /*jslint unparam: false*/
    metadata = $.extend({}, call, application);
    saved = metadata['jconon_application:stato_domanda'] === 'P';
    bulkInfoRender(call);
  }

  $('#save').click(function () {
    bulkinfo.resetForm();

    var close = UI.progress();

    jconon.Data.application.main({
      type: 'POST',
      data: bulkinfo.getData(),
      success: function (data) {
        if (!cmisObjectId) {
          cmisObjectId = data.id;
          bulkinfo.addFormItem('cmis:objectId', cmisObjectId);
          UI.success(i18n['message.creazione.application']);
        } else {
          UI.success(i18n['message.aggiornamento.application']);
        }
        saved = true;
      },
      complete: close,
      error: URL.errorFn
    });
  });
  $('#send').click(function () {
    var message = 'message.conferma.application.question',
      placeholder = '';
    if (metadata["jconon_call:elenco_sezioni_domanda"].indexOf('affix_tabProdottiScelti') !== -1 &&
        $('#affix_tabProdottiScelti').find('table:visible').length === 0) {
      placeholder = i18n.prop('message.conferma.application.prodotti.scelti');
    }
    UI.confirm(i18n.prop(message, placeholder), function () {
      if (bulkinfo.validate()) {
        Application.send(bulkinfo.getData(), function () {
          window.location.href = cache.redirectUrl;
        });
      } else {
        UI.alert(i18n['message.improve.required.fields']);
      }
    });
  });
  $('#close').click(function () {
    UI.confirm(i18n.prop('message.exit.without.saving'), function () {
      window.location.href = document.referrer;
    });
  });
  $('#print').click(function () {
    Application.print(cmisObjectId, metadata['jconon_application:stato_domanda'], true);
  });
  $('#delete').click(function () {
    Application.remove(cmisObjectId, function () {
      window.location.href = cache.redirectUrl;
    });
  });
  function main() {
    var xhr = Call.loadLabels(callId);
    xhr.done(function () {
      URL.Data.node.node({
        data: {
          excludePath : true,
          nodeRef : callId,
          cachable: false
        },
        callbackErrorFn: jconon.callbackErrorFn,
        success: function (dataCall) {
          applicationAttachments = Application.completeList(
            dataCall['jconon_call:elenco_association'],
            cache.jsonlistApplicationAttachments
          );
          curriculumAttachments = Application.completeList(
            dataCall['jconon_call:elenco_sezioni_curriculum'],
            cache.jsonlistApplicationCurriculums
          );
          curriculumAttachmentsUlteriore = Application.completeList(
            dataCall['jconon_call:elenco_sezioni_curriculum_ulteriore'],
            cache.jsonlistApplicationCurriculums
          );
          prodottiAttachments = Application.completeList(
            dataCall['jconon_call:elenco_prodotti'],
            cache.jsonlistApplicationProdotti
          );
          schedeAnonimeAttachments = Application.completeList(
            dataCall['jconon_call:elenco_schede_anonime'],
            cache.jsonlistApplicationSchedeAnonime
          ); 
          jconon.Data.application.main({
            type: 'GET',
            queue: true,
            placeholder: {
              callId: callId,
              applicationId: params.applicationId,
              userId: common.User.id,
              preview: preview
            },
            callbackErrorFn: jconon.callbackErrorFn
          }).done(function (dataApplication) {
            var message = $('#surferror').text() || 'Errore durante il recupero della domanda';
            if (!common.User.admin && common.User.id !== dataApplication['jconon_application:user']) {
              UI.error(i18n['message.error.caller.user'], function () {
                window.location.href = cache.redirectUrl;
              });
            } else {
              URL.Data.proxy.people({
                type: 'GET',
                contentType: 'application/json',
                placeholder: {
                  user_id: dataApplication['jconon_application:user']
                },
                success: function (data) {
                  dataPeopleUser = data;
                  manageIntestazione(dataCall, dataApplication);
                  render(dataCall, dataApplication);
                },
                error: function () {
                  UI.error(i18n['message.user.not.found']);
                  window.location.href = cache.redirectUrl;
                }
              });
            }
            toolbar.show();
          });
        }
      });
    });    
  }
  $('button', toolbar).tooltip({
    placement: 'bottom',
    container: toolbar
  });
  if (callCodice) {
    URL.Data.search.query({
      data: {
        q: "select cmis:objectId " +
          "from jconon_call:folder where jconon_call:codice = '" + callCodice + "'"
      },
      success: function (data) {
        callId = data.items[0]['cmis:objectId'];
        main();
      }
    });

  } else {
    main();
  }  
});