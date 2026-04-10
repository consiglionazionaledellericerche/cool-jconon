/* javascript closure providing all the search functionalities */
define(['jquery', 'cnr/cnr', 'i18n', 'cnr/cnr.actionbutton', 'json!common', 'handlebars', 'cnr/cnr.validator', 'cnr/cnr.url', 'cnr/cnr.ui', 'cnr/cnr.criteria', 'cnr/cnr.search', 'moment', 'json!cache'], function ($, CNR, i18n, ActionButton, common, Handlebars, validator, URL, UI, Criteria, Search, moment, cache) {
  "use strict";
  var urls = {
    call : {
      manage: 'manage-call',
      main: 'rest/manage-call/main',
      publish: 'rest/manage-call/publish',
      child: 'rest/manage-call/child',
      loadLabels: 'rest/manage-call/load-labels',
      jsonLabels: 'rest/manage-call/json-labels',
      copyLabels: 'rest/manage-call/copy-labels',
      applications_single_call: 'rest/call/applications-single-call.xls',
      applications_punteggi: 'rest/call/applications-punteggi.xls',
      applications_punteggi_async: 'rest/call/applications-punteggi-async.xls',
      applications_graduatoria: 'rest/call/graduatoria',
      applications: 'rest/call/applications.xls',
      applications_convocazioni: 'rest/call/applications-convocazioni.xls',
      downloadXLS: 'rest/call/download-xls',      
      convocazioni: 'rest/call/convocazioni',
      esclusioni: 'rest/call/esclusioni',
      comunicazioni: 'rest/call/comunicazioni',
      inviaallegato: 'rest/call/invia-allegato',
      eliminaallegati: 'rest/call/elimina-allegati',
      aggiornaprotocollodomande: 'rest/call/aggiorna-protocollo-domande',
      linkcallfile: 'rest/call/link-to-call-child',
      copycallfile: 'rest/call/copy-to-call-child',
      aggiungi_allegato: 'aggiungi-allegato',
      detail: 'call-detail',
      punteggi: {
        carica: 'carica-punteggi'
      },
      convocazione: {
        genera: 'convocazione',
        visualizza: 'show-convocazione',
        pageExamSessions: 'exam-sessions',
        firma: 'rest/call/firma-convocazioni',
        invia: 'rest/call/invia-convocazioni',
        examSessions: 'openapi/v1/call/exam-sessions/$id',
        examMoodleSessions: 'openapi/v1/call/exam-moodle-sessions/$id'
      },
      esclusione: {
        genera: 'esclusione',
        visualizza: 'show-esclusione',
        firma: 'rest/call/firma-esclusioni',
        invia: 'rest/call/invia-esclusioni'
      },
      comunicazione: {
        genera: 'comunicazione',
        visualizza: 'show-comunicazione',
        firma: 'rest/call/firma-comunicazioni',
        invia: 'rest/call/invia-comunicazioni'
      }
    },
    application : {
      manage: 'manage-application',
      main: 'rest/manage-application/main',
      punteggi: 'rest/manage-application/punteggi',
      validate_attachments: 'rest/manage-application/validate-attachments',
      add_contributor_product_after_commission: 'rest/manage-application/add-contributor/product-after-commission',
      remove_contributor_product_after_commission: 'rest/manage-application/remove-contributor/product-after-commission',
      print: 'rest/application/print',
      send: 'rest/manage-application/send',
      reopen: 'rest/manage-application/reopen',
      paste: 'rest/manage-application/paste',
      list: 'applications',
      schede_anonime : 'schede-anonime',
      print_dic_sost: 'rest/application/dichiarazione_sostitutiva',
      print_trattamento_dati_personali: 'rest/application/print_trattamento_dati_personali',
      download_avviso_pagopa: 'rest/application/download_avviso_pagopa',
      print_avviso_pagopa: 'rest/application/print_avviso_pagopa?applicationId=$applicationId',
      paga_avviso_pagopa: 'rest/application/paga_avviso_pagopa?applicationId=$applicationId',
      move_prodotto: 'rest/manage-application/move_prodotto',
      print_scheda_valutazione: 'rest/application/print_scheda_valutazione',
      reject: 'rest/application/reject',
      waiver: 'rest/application/waiver',
      retirement: 'rest/application/retirement',
      readmission: 'rest/application/readmission',
      exportSchedeValutazione: 'rest/application/exportSchedeValutazione',
      generaSchedeValutazione: 'rest/application/generaSchedeValutazione',
      generaSchedeAnonime: 'rest/application/generaSchedeAnonime',
      concludiProcessoSchedeAnonime:'rest/application/concludiProcessoSchedeAnonime',
      visualizzaSchedeNonAnonime:'rest/application/visualizzaSchedeNonAnonime',
      abilitaProcessoSchedeAnonime:'rest/application/abilitaProcessoSchedeAnonime',
      scheda_valutazione: 'scheda-valutazione',
      exportApplications: 'rest/exportApplications/$store_type/$store_id/$id',
      exportSchedeAnonime: 'rest/proxy' + '?url=service/zipper/zipContent&query=$query&destination=$destination&filename=$filename&noaccent=true'
    },
    commission : {
      register: "rest/commission/register.xls"
    },
    people : {
      query: "rest/search/people?guest=true",
      content: "search/people/content?guest=true",
      importa: "people/import/product"
    },
    helpdesk : {
      send: 'rest/helpdesk/send',
      categorie: 'rest/helpdesk/categorie',
      esperti: 'rest/helpdesk/esperti'
    },
    user: {
        titles: 'rest/static/json/user-titles.json?v=' + common.artifact_version,
        grades: 'rest/static/json/user-grades.json?v=' + common.artifact_version
    }
  },
    defaults = {},
    settings = defaults;

  function init(options) {
    settings = $.extend({}, defaults, options);
  }

  function modelTitleType() {
    var documentsType = cache.jsonlistApplicationAttachments.
      concat(cache.jsonlistCallAttachments).
      concat(cache.jsonlistCallType).
      concat(cache.jsonlistApplicationCurriculums).
      concat(cache.jsonlistApplicationPeopleAttachments).
      concat(cache.jsonlistApplicationSchedeAnonime),
      filtered = $.grep(documentsType, function (el) {
        if (el && !i18n[el.key]) {
          i18n[el.key] = el.defaultLabel || el.title;
        }
        if (el && !i18n[el.id]) {
          i18n[el.id] = el.defaultLabel || el.title;
        }
      });
  }
  function toHTML(el) {
    return $('<div>').append(el).html();
  }

  validator.addMethod('importo',
    function (value) {
      if (value !== "") {
        var regex = new RegExp("^[0-9]+(" + (i18n.locale === 'en' ? "\\." : ',') + "[0-9]+)?$", "g");
        return regex.exec(value);
      }
      return true;
    }, i18n['message.importo.valido']
    );

  $(document.body).on('click', '.code', function () {
    if (common.page_call_detail) {
        location.href = cache.baseUrl + '/call-detail?callCode=' + $(this).text();
    } else {
        var data = $("<div></div>").addClass('modal-inner-fix').html($(this).data('content')),
          objectId = $(this).data('objectid'),
          title = i18n['label.call'];
        URL.Data.search.query({
          queue: true,
          data: {
            q: 'select cmis:objectId from jconon_attachment:call_it where IN_FOLDER(\'' + objectId + '\')'
          }
        }).done(function (rs) {
          $.map(rs.items, function (item) {
            title = '<a href="'+ URL.urls.search.content + '?nodeRef=' + item['cmis:objectId'] + '&guest=true' + '">Scarica bando di concorso</a>';
          });
          UI.modal('<i class="icon-info-sign text-info animated flash"></i> ' + title, data);
        }).fail(function (jqXHR, textStatus, errorThrown) {
          CNR.log(jqXHR, textStatus, errorThrown);
        });
    }
  });

  Handlebars.registerHelper('code', function code(label, label_en, className, callData, callData_en, objectId) {
    var a = $('<a href="#" class="' + className + '">' + (i18n.locale === 'en' ? label_en : label) + '</a>')
      .attr('data-content', i18n.locale === 'en' ? callData_en : callData).attr('data-objectId', objectId);
    return $('<div>').append(a).html();
  });
  function defaultDisplayDocument(el, refreshFn, permission, showLastModificationDate, showTitleAndDescription, extendButton, customIcons, maxUploadSize, i18nLabelsObj) {
    var tdText,
      tdButton,
      isFolder = el.baseTypeId === 'cmis:folder',
      item = $('<a href="#">' + el.name + '</a>'),
      customButtons = $.extend({}, {
        history : false,
        copy: false,
        cut: false
      }, extendButton),
      typeLabel = i18nLabelsObj && i18nLabelsObj[el.objectTypeId] ? i18nLabelsObj[el.objectTypeId].newLabel : i18n[el.objectTypeId],
      annotationType = $('<span class="muted annotation">' + typeLabel  + '</span>'),
      annotation = $('<span class="muted annotation">ultima modifica: ' + CNR.Date.format(el.lastModificationDate, null, 'DD/MM/YYYY H:mm') + '</span>');
    if (permission !== undefined) {
      customButtons.permissions = permission;
    }
    item.attr('href', URL.urls.search.content + '?nodeRef=' + el.id + '&guest=true');
    item.after(annotationType);
    if (showTitleAndDescription) {
      item.after($('<span class="muted annotation">' + '<b>Titolo:</b> ' + el['cm:title']  + ' <b>Descrizione:</b> ' + el['cm:description'] + '</span>'));
    }
    if (showLastModificationDate === false) {
      item.after('<span class="muted annotation">' + CNR.fileSize(el.contentStreamLength) + '</span>');
    } else {
      item.after(annotation.prepend(', ').prepend(CNR.fileSize(el.contentStreamLength)));
    }

    tdText = $('<td></td>')
      .addClass('span10')
      .append(CNR.mimeTypeIcon(el.contentType, el.name))
      .append(' ')
      .append(item);
    tdButton = $('<td></td>').addClass('span2').append(ActionButton.actionButton({
      name: el.name,
      nodeRef: el['alfcmis:nodeRef'],
      baseTypeId: el.baseTypeId,
      objectTypeId: el.objectTypeId,
      mimeType: el.contentType,
      allowableActions: el.allowableActions
    }, null, customButtons, customIcons, refreshFn, undefined, maxUploadSize));
    return $('<tr></tr>')
      .append(tdText)
      .append(tdButton);
  }

  function findCallQueryName(id) {
    var queryName;
    $.each(cache.jsonlistCallType, function (index, el) {
      if (el.id === id) {
        queryName = el.queryName;
      }
    });
    return queryName;
  }

  function getCriteria(bulkInfo, attivi_scadutiValue) {
    var propDataInizio = 'root.jconon_call:data_inizio_invio_domande_index',
      propDataFine = 'root.jconon_call:data_fine_invio_domande_index',
      criteria = new Criteria(),
      timestamp = moment(common.now).toDate().getTime(),
      isoDate;

    // il timestamp cambia ogni 10 minuti
    timestamp = timestamp - timestamp % (10 * 60 * 1000);
    isoDate = new Date(timestamp).toISOString();
    $.each(bulkInfo.getFieldProperties(), function (index, el) {
      var propValue = bulkInfo.getDataValueById(el.name),
        re = /^criteria\-/;
      if (el.property) {
        if (el['class'] && propValue) {
          $(el['class'].split(' ')).each(function (index, myClass) {
            if (re.test(myClass)) {
              var fn = myClass.replace(re, '');
              propValue = propValue.replace('\'', '\\\'');
              if (fn === 'contains') {
                if (cache['query.index.enable']) {
                    criteria[fn](el.property + ':\\\'*' + propValue + '*\\\'', 'root');
                } else {
                    criteria['like']('root.' + el.property, propValue, null);
                }
              } else {
                criteria[fn](el.property, propValue, el.widget === 'ui.datepicker' ? 'date' : null);
              }
            }
          });
        } else {
          if (propValue) {            
            criteria.equals(el.property, propValue.replace('\'', '\\\''));
          }
        }
      }
      if (el.name === 'filters-attivi_scaduti') {
        if (attivi_scadutiValue ? attivi_scadutiValue === 'attivi' : propValue === 'attivi') {
          criteria.lte(propDataInizio, isoDate, 'date');
          criteria.or(
            {type: '>=', what: propDataFine, to: isoDate, valueType: 'date'},
            {type: 'NULL', what: propDataFine}
          );
        } else if (attivi_scadutiValue ? attivi_scadutiValue === 'scaduti' : propValue === 'scaduti') {
          criteria.lte(propDataFine, isoDate, 'date');
        } else if (attivi_scadutiValue ? attivi_scadutiValue === 'tutti' : propValue === 'tutti') {
          if (!(common.User.admin || (common.User.groupsArray &&
                (common.User.groupsArray.indexOf('GROUP_GESTORI_BANDI') !== -1 || common.User.groupsArray.indexOf('GROUP_CONCORSI') !== -1 )))) {
            criteria.or(
                {type: '<=', what: propDataInizio, to: isoDate, valueType: 'date'},
                {type: '=', what: 'root.cmis:createdBy', to: common.User.userName, valueType: 'string'}
            );
          }
        }
      }
    });
    return criteria;
  }
  modelTitleType();

  function convertRomanNumberToInt(roman) {
    var decimal = 0, x = 0, convertToDecimal;
    for (x = 0; x < roman.length; x++) {
      convertToDecimal = roman.charAt(x);
      switch (convertToDecimal) {
      case 'M':
        decimal += 1000;
        break;
      case 'D':
        decimal += 500;
        break;
      case 'C':
        decimal += 100;
        break;
      case 'L':
        decimal += 50;
        break;
      case 'X':
        decimal += 10;
        break;
      case 'V':
        decimal += 5;
        break;
      case 'I':
        decimal += 1;
        break;
      }
    }
    if (roman.indexOf("IV") !== -1) {
      decimal -= 2;
    }
    if (roman.indexOf("IX") !== -1) {
      decimal -= 2;
    }
    if (roman.indexOf("XL") !== -1) {
      decimal -= 10;
    }
    if (roman.indexOf("XC") !== -1) {
      decimal -= 10;
    }
    if (roman.indexOf("CD") !== -1) {
      decimal -= 100;
    }
    if (roman.indexOf("CM") !== -1) {
      decimal -= 100;
    }
    return decimal;
  }
  function findAllegati(cmisObjectId, element, customType, fetchCmisObject, displayFunction, calculateTotalNumItems, parentProp, i18nLabelsObj) {
    var pagination = $('<div class="pagination pagination-centered"><ul></ul></div>'),
      displayTable = $('<table class="table table-striped"></table>'),
      emptyResultset = $('<div class="alert"></div>').hide().append(i18n['label.count.no.document']),
      allegati = new Search({
        type: customType || undefined,
        elements: {
          table: displayTable,
          pagination: pagination,
          label: emptyResultset
        },
        orderBy: [{
            field: "cmis:creationDate",
            asc: false
        }],
        mapping: function (mapping, doc) {
          mapping.parentId = cmisObjectId;
          mapping.parentProp = parentProp;
          mapping.objectTypeDisplayName = doc['cmis:objectTypeDisplayName'] !== undefined ? doc['cmis:objectTypeDisplayName'] : null;
          return mapping;
        },
        calculateTotalNumItems: calculateTotalNumItems || false,        
        fetchCmisObject: fetchCmisObject || false,
        maxItems: 5,
        i18nLabelsObj: i18nLabelsObj,
        display : {
          row : displayFunction || defaultDisplayDocument
        }
      }),
      criteria = new Criteria();
    element
      .append(displayTable)
      .append(pagination)
      .append(emptyResultset);
    init({
      refreshFn: function (d) {
        criteria.inFolder(cmisObjectId).list(allegati);
      }
    });
    criteria.inFolder(cmisObjectId).list(allegati);
  }

  /* Revealing Module Pattern */
  return {
    URL: urls,
    Data: URL.initURL(urls),
    init: init,
    defaultDisplayDocument: defaultDisplayDocument,
    findCallQueryName: findCallQueryName,
    getCriteria: getCriteria,
    callbackErrorFn: function () {
      window.location.href = (window.location.href !== document.referrer) ? document.referrer : cache.redirectUrl;
    },
    joinQuery: function (queryName, aspectsType, excludeAspects, alias) {
      var source = queryName;
      $.map(aspectsType, function (el) {
        if (el !== undefined) {
          if ((excludeAspects && excludeAspects.indexOf(el) === -1) || !excludeAspects)  {
            var aspectQueryName = el.substring(2);
            source += " JOIN " + aspectQueryName + " AS " + aspectQueryName +
              " ON " + (alias ? alias + "." : "") + "cmis:objectId = " + aspectQueryName + ".cmis:objectId ";
          }
        }
      });
      return source;
    },
    findAllegati: findAllegati,
    orderListWithRomanNumber: function (list, field, separator) {
      list.sort(function (a, b) {
        var firstValue = convertRomanNumberToInt(a[field].substring(0, a[field].indexOf(separator))),
          secondValue = convertRomanNumberToInt(b[field].substring(0, b[field].indexOf(separator)));
        return firstValue - secondValue;
      });
    },
    addUserToGroup: function (groupName, userName, callbackDone) {
      URL.Data.proxy.childrenGroup({
        type: 'POST',
        data: JSON.stringify({
          'parent_group_name': "GROUP_" + groupName,
          'child_name': userName
        }),
        contentType: 'application/json'
      }).done(function () {
        callbackDone();
      }).fail(function () {
        UI.error("impossibile aggiungere " + userName + " al gruppo " + groupName);
      });
    },
    removeUserFromGroup: function (groupName, userName, callbackDone) {
      URL.Data.proxy.group({
        data: {
          shortName: groupName
        },
        success: function (data) {
          URL.Data.proxy.childrenGroup({
            type: 'DELETE',
            placeholder: {
              childFullName: userName,
              parentNodeRef: data.nodeRef
            }
          }).done(function () {
            callbackDone();
          }).fail(function () {
            UI.error('impossibile eliminare l\'associazione con ' + userName);
          });
        }
      });
    },
    progressBar: function(value) {
      $('.progress div').text(value);
      $('.progress div').attr('style', 'width:' + value);
    }
  };
});
