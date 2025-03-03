/* javascript closure providing all the search functionalities */
define(['jquery', 'cnr/cnr', 'i18n', 'cnr/cnr.actionbutton', 'cnr/cnr.ui', 'cnr/cnr.jconon', 'cnr/cnr.url',
  'cnr/cnr.search', 'cnr/cnr.criteria', 'cnr/cnr.node', 'cnr/cnr.bulkinfo', 'json!cache','json!common'
  ], function ($, CNR, i18n, ActionButton, UI, jconon, URL, Search, Criteria, Node, BulkInfo, cache, common) {
  "use strict";

  function completeList(properties, commonProperties) {
    var results = [];
    if (properties) {
      $.each(properties, function (index, prop) {
        $.grep(commonProperties, function (el) {
          if (el && prop === el.key) {
            results.push(el);
          }
        });
      });
    }
    return results;
  }

  function punteggi(callData, id, modalHeader, callback) {
    var content = $("<div></div>").addClass('modal-inner-fix'),
        addon = '<span class="add-on text-info">',
        closeSpan = '</span>',
        m,
        bulkinfo = new BulkInfo({
        target: content,
        path: "P:jconon_application:aspect_punteggi",
        objectId: id,
        formclass: 'form-horizontal',
        name: 'default',
        callback : {
          afterCreateForm: function (form) {
            if (callData['jconon_call:punteggio_1'] && callData['jconon_call:punteggio_1'] !== 'Vuoto') {
                form.find('label[for=\'punteggio_titoli\']').append(callData['jconon_call:punteggio_1']);
                form.find('#punteggio_titoli')
                    .before(addon + callData['jconon_call:punteggio_1_min']  + closeSpan)
                    .after(addon + callData['jconon_call:punteggio_1_limite'] + closeSpan);
            } else {
                form.find('#punteggio_titoli').parents('.control-group').hide();
            }
            if (callData['jconon_call:punteggio_2'] && callData['jconon_call:punteggio_2'] !== 'Vuoto') {
                form.find('label[for=\'punteggio_scritto\']').append(callData['jconon_call:punteggio_2']);
                form.find('#punteggio_scritto')
                    .before(addon + callData['jconon_call:punteggio_2_min']  + closeSpan)
                    .after(addon + callData['jconon_call:punteggio_2_limite'] + closeSpan);
            } else {
                form.find('#punteggio_scritto').parents('.control-group').hide();
            }
            if (callData['jconon_call:punteggio_3'] && callData['jconon_call:punteggio_3'] !== 'Vuoto') {
                form.find('label[for=\'punteggio_secondo_scritto\']').append(callData['jconon_call:punteggio_3']);
                form.find('#punteggio_secondo_scritto')
                    .before(addon + callData['jconon_call:punteggio_3_min']  + closeSpan)
                    .after(addon + callData['jconon_call:punteggio_3_limite'] + closeSpan);
            } else {
                form.find('#punteggio_secondo_scritto').parents('.control-group').hide();
            }
            if (callData['jconon_call:punteggio_4'] && callData['jconon_call:punteggio_4'] !== 'Vuoto') {
                form.find('label[for=\'punteggio_colloquio\']').append(callData['jconon_call:punteggio_4']);
                form.find('#punteggio_colloquio')
                    .before(addon + callData['jconon_call:punteggio_4_min']  + closeSpan)
                    .after(addon + callData['jconon_call:punteggio_4_limite'] + closeSpan);
            } else {
                form.find('#punteggio_colloquio').parents('.control-group').hide();
            }
            if (callData['jconon_call:punteggio_5'] && callData['jconon_call:punteggio_5'] !== 'Vuoto') {
                form.find('label[for=\'punteggio_prova_pratica\']').append(callData['jconon_call:punteggio_5']);
                form.find('#punteggio_prova_pratica')
                    .before(addon + callData['jconon_call:punteggio_5_min']  + closeSpan)
                    .after(addon + callData['jconon_call:punteggio_5_limite'] + closeSpan);
            } else {
                form.find('#punteggio_prova_pratica').parents('.control-group').hide();
            }
            if (callData['jconon_call:punteggio_6'] && callData['jconon_call:punteggio_6'] !== 'Vuoto') {
                form.find('label[for=\'punteggio_6\']').append(callData['jconon_call:punteggio_6']);
                form.find('#punteggio_6')
                    .before(addon + callData['jconon_call:punteggio_6_min']  + closeSpan)
                    .after(addon + callData['jconon_call:punteggio_6_limite'] + closeSpan);
            } else {
                form.find('#punteggio_6').parents('.control-group').hide();
            }
            if (callData['jconon_call:punteggio_7'] && callData['jconon_call:punteggio_7'] !== 'Vuoto') {
                form.find('label[for=\'punteggio_7\']').append(callData['jconon_call:punteggio_7']);
                form.find('#punteggio_7')
                    .before(addon + callData['jconon_call:punteggio_7_min']  + closeSpan)
                    .after(addon + callData['jconon_call:punteggio_7_limite'] + closeSpan);
            } else {
                form.find('#punteggio_7').parents('.control-group').hide();
            }
          }
        }
      });
      bulkinfo.render();
      m = UI.bigmodal('<i class="icon-edit"></i> Punteggi' + modalHeader, content, function () {
        var d = bulkinfo.getData();
        d.push(
          {
            id: 'applicationId',
            name: 'applicationId',
            value: id
          },
          {
            id: 'callId',
            name: 'callId',
            value: callData['cmis:objectId']
          },
          {
            name: 'aspect',
            value: 'P:jconon_application:aspect_punteggi'
          }
        );
        if (bulkinfo.validate()) {
            var close = UI.progress();
            jconon.Data.application.punteggi({
              type: 'PUT',
              data: d,
              success: function (data) {
                m.modal('hide');
                UI.success(i18n['message.aggiornamento.application.punteggi'] + data.message, function() {
                    if (callback) {
                        callback();
                    }
                });
              },
              complete: close,
              error: URL.errorFn
            });
            return false;
        } else {
            return false;
        }
      });
  }

  function defaultPeopleDisplayDocument(el) {
    var tdText,
      item = $('<a href="#">' + (el['cm:title'] || el.name) + '</a>'),
      annotationType = $('<span class="muted annotation">' + i18n[el['cmis:objectTypeId']]  + '</span>'),
      annotation = $('<span class="muted annotation">modificato ' + CNR.Date.format(el.lastModificationDate) + '</span>');

    item.attr('href', jconon.URL.people.content + '&nodeRef=' + el.id);
    item.after(annotationType);
    item.after(annotation.prepend(', ').prepend(CNR.fileSize(el.contentStreamLength)));

    tdText = $('<td></td>')
      .addClass('span10')
      .append(CNR.mimeTypeIcon(el.contentType, el.name))
      .append(' ')
      .append(item);
    return $('<tr></tr>')
      .append(tdText);
  }

  function findPeopleAllegati(cmisObjectId, element) {
    /*jslint unparam: true*/
    var pagination = $('<div class="pagination pagination-centered"><ul></ul></div>'),
      displayTable = $('<table class="table table-striped"></table>'),
      emptyResultset = $('<div class="alert"></div>').hide().append(i18n['label.count.no.document']),
      allegati = new Search({
        elements: {
          table: displayTable,
          pagination: pagination,
          label: emptyResultset
        },
        mapping: function (mapping, doc) {
          mapping.objectTypeDisplayName = doc['cmis:objectTypeDisplayName'] !== undefined ? doc['cmis:objectTypeDisplayName'] : null;
          return mapping;
        },
        dataSource: function (page, settings, getUrlParams) {
          return jconon.Data.people.query({
            queue: true,
            data: getUrlParams(page)
          });
        },
        maxItems: 5,
        fetchCmisObject: true,
        display : {
          row : defaultPeopleDisplayDocument
        }
      }),
      criteria = new Criteria();
    /*jslint unparam: false*/
    element
      .append(displayTable)
      .append(pagination)
      .append(emptyResultset);
    jconon.init({
      refreshFn: function () {
        criteria.inFolder(cmisObjectId).list(allegati);
      }
    });
    criteria.inFolder(cmisObjectId).list(allegati);
  }

  function findAttachementsInRel(cmisObjectId, element) {
    var pagination = $('<div class="pagination pagination-centered"><ul></ul></div>'),
      displayTable = $('<table class="table table-striped"></table>'),
      emptyResultset = $('<div class="alert"></div>').hide().append(i18n['label.count.no.document']),
      allegati = new Search({
        elements: {
          table: displayTable,
          pagination: pagination,
          label: emptyResultset
        },
        mapping: function (mapping, doc) {
          mapping.objectTypeDisplayName = doc['cmis:objectTypeDisplayName'] !== undefined ? doc['cmis:objectTypeDisplayName'] : null;
          return mapping;
        },
        dataSource: function () {
          return URL.Data.search.query({
            queue: true,
            data: {
              objectRel: cmisObjectId,
              'relationship.name' : 'R:jconon_attachment:in_prodotto'
            }
          });
        },
        maxItems: 100,
        display : {
          row : jconon.defaultDisplayDocument
        }
      });
    element
      .append(displayTable)
      .append(pagination)
      .append(emptyResultset);
    jconon.init({
      refreshFn: function () {
        allegati.execute();
      }
    });
    allegati.execute();
    return allegati;
  }

  function moveProdotto(el, refreshFn, refreshFn2) {
    var close = UI.progress();
    jconon.Data.application.move_prodotto({
      type: 'POST',
      placeholder: {
        prodottoId: el.id
      },
      success: function (data) {
        close();
        UI.success(i18n['message.operation.performed']);
        if (typeof refreshFn === 'function') {
          refreshFn();
        }
        if (typeof refreshFn2 === 'function') {
          refreshFn2();
        }
      },
      complete: close
    });
  }

  function editProdotti(el, title, refreshFn, copy, type, sourceValue, move) {
    var content = $("<div></div>").addClass('modal-inner-fix'), bulkinfo, fileName, regex = /^.*:([^:]*)/gi,
      modalTitle = (copy ? "Duplica " : "Modifica ") + "(" + title + ")",
      afterRender = function (form) {
        if (sourceValue) {
          var tmp = $("<div class='control-group'></div>"),
            label = $("<label class='control-label'>Visualizzazione completa della riga copiata</label>"),
            input = $("<textarea class='input-xxlarge' rows='5' readonly></textarea>");
          input.val(sourceValue.replace(/\n+/g, '\n'));
          tmp.append(label);
          $("<div class='controls'></div>").appendTo(tmp).append(input);
          tmp.appendTo(form);
        }
        if (type) {
          modalTitle = move ? i18n['actions.move'] : i18n['actions.paste_row'];
          modalTitle += " " + i18n[type];
        }
        UI.bigmodal(modalTitle, content, function () {
          if (!bulkinfo.validate()) {
            UI.alert("alcuni campi non sono corretti");
            return false;
          }
          var d = bulkinfo.getData();
          if (copy) {
            fileName = el.objectTypeId.replace(regex, "$1");
            fileName += '_' + (new Date().getTime());
            d.push({name: 'cmis:name', value: fileName});
            d.push({name: 'cmis:parentId', value: el.parentId});
            d.push({name: 'cmis:objectTypeId', value: el.objectTypeId});
            if (el.addAspect) {
              d.push({name: 'aspect', value: el.addAspect});
            }
            d.push({name: 'jconon_attachment:user', value: el['jconon_attachment:user']});
          } else {
            d.push({
              id: 'cmis:objectId',
              name: 'cmis:objectId',
              value: el.id
            });
          }
          Node.updateMetadata(d, function () {
            UI.success(i18n['message.operation.performed']);
            if (copy) {
              if (move) {
                Node.remove(el.id, refreshFn, false);
              } else {
                refreshFn();
              }
            }
          });
        });
      };
    bulkinfo = new BulkInfo({
      target: content,
      path: type || el.objectTypeId,
      objectId: el.id,
      callback: {
        afterCreateForm: afterRender
      }
    });
    bulkinfo.render();
  }

  function peopleDisplayDocument(el) {
    var tdText,
      tdButton,
      item = $('<strong>' + el.titolo + '</strong>'),
      annotationTipo = $('<span class="muted annotation"><strong>(' + el.anno + ') ' + el.tipo + '</strong></span>'),
      annotationAutori = $('<span class="muted annotation"><strong>Autori:</strong> ' + el.autori  + '</span>'),
      annotation = $('<span class="muted annotation"><strong>Affiliazioni:</strong> ' + el.affiliazioni + '</span>'),
      annotationIdPeople = $('<span class="muted annotation"><strong>ID People:</strong> ' + el.name.substring(el.name.indexOf('-') + 1) + '</span>');

    item.after(annotationTipo);
    item.after(annotationAutori);
    item.after(annotation);
    item.after(annotationIdPeople);

    tdText = $('<td></td>')
      .addClass('span10')
      .append(item);
    tdButton = $('<td></td>').addClass('span2').append(ActionButton.actionButton({
      name: el.name,
      nodeRef: el.id,
      baseTypeId: el.baseTypeId,
      objectTypeId: el.objectTypeId,
      mimeType: el.contentType,
      allowableActions: el.allowableActions,
      defaultChoice: 'peopleImport'
    }, null, {
      select : false,
      history : false,
      copy: false,
      cut: false,
      peopleAttachments : function () {
        jconon.Data.people.query({
          queue: true,
          data: {
            q: 'select cmis:objectId from cmis:folder where cmis:name = \'' + el.folderAttachName + '\''
          }
        }).done(function (rs) {
          if (rs.totalNumItems === 0) {
            UI.alert('Non esistono allegati al Prodotto');
          } else {
            var content = $('<div></div>').addClass('modal-inner-fix');
            findPeopleAllegati(rs.items[0]['cmis:objectId'], content);
            UI.modal(i18n['title.prodotti.people'], content);
          }
        });
      },
      peopleImport : function () {
        UI.confirm(i18n.prop('message.import.people.product', el.titolo, i18n[el.jconontype[0]]), function () {
          var close = UI.progress();
          jconon.Data.people.importa({
            queue: true,
            type: 'POST',
            data: [
              {name : 'jcononType', value: el.jconontype[0]},
              {name : 'peopleId', value: el.id},
              {name : 'applicationId', value: el.applicationId},
              {name : 'aspect', value: el.aspect}
            ]
          }).success(function () {
            UI.success('Prodotto importato correttamente.<br><strong>Si ricorda di rientrare in modifica nelle schede dei prodotti importati nella domanda da People, per controllare ed eventualmente completare le informazioni  richieste dal bando di concorso.</strong>');
          }).complete(function () {
            close();
          });
        });
      }
    }, {peopleImport: 'icon-download', peopleAttachments : 'icon-download-alt'}));
    return $('<tr></tr>')
      .append(tdText)
      .append(tdButton);
  }

  function i18nLabel(key, props) {
      var product = $.grep(props, function (el) {
          if (el && key === el.key) {
            return el;
          }
      });
      if (product && product.length == 1) {
        return i18n.prop(key, product[0].defaultLabel);
      }
      return i18n[key];
  }

  function headerProdotti(el, i18nLabelsObj) {
    var tdText,
      anno = el['cvpeople:anno'],
      title = el['cvpeople:titolo']||el['cmis:name'],
      item = $('<a href="#">' + title + '</a>').on('click', function () {
        Node.displayMetadata(el.objectTypeId, el.id, true);
        return false;
      }),
      typeLabel = i18nLabelsObj && i18nLabelsObj[el.objectTypeId] ? i18nLabelsObj[el.objectTypeId].newLabel : i18nLabel(el.objectTypeId, cache.jsonlistApplicationProdotti),
      annotation = $('<span class="muted annotation">ultima modifica: ' + CNR.Date.format(el.lastModificationDate, null, 'DD/MM/YYYY H:mm') + '</span>'),
      annotationObjectType = $('<span class="annotation"><strong>' + typeLabel + '</strong></span>'),
      annotationTipo = $('<span class="muted annotation"><strong>(' + anno + ') ' + el['cvpeople:id_tipo_txt'] + '</strong></span>'),
      annotationAutori = $('<span class="muted annotation"><strong>Autori:</strong> ' + el['cvpeople:autori']  + '</span>'),
      annotationDOI = $('<span class="muted annotation"><strong>DOI: </strong><a href="http://dx.doi.org/' + el['cvpeople:doi'] + '" target="_blank">' + el['cvpeople:doi']  + '</a></span>');
    if (anno) {
        item.after(annotationTipo);
        item.after(annotationAutori);
        if (el['cvpeople:doi']) {
          item.after(annotationDOI);
        }
    } else {
        item.attr('href', URL.urls.search.content + '?nodeRef=' + el.id + '&guest=true');
        item.off('click');
        item.after(annotation.prepend(', ').prepend(CNR.fileSize(el.contentStreamLength)))
    }
    tdText = $('<td></td>')
      .addClass('span10')
      .append(annotationObjectType)
      .append(item);
    return tdText;
  }

  function isConcorsi() {
    return common.User.groupsArray && common.User.groupsArray.indexOf("GROUP_CONCORSI") !== -1;
  }

  function displayProdottiScelti(el, refreshFn, i18nLabel, refreshFnProdotti, isMoveable) {
    var tdText = headerProdotti(el, i18nLabel),
      isAbleToViewHistory = common.User.admin || isConcorsi() || common.User.id === el['jconon_attachment:user'],
      tdButton;
    tdButton = $('<td></td>').addClass('span2').append(ActionButton.actionButton({
      name: el.name,
      nodeRef: el.id,
      baseTypeId: el.baseTypeId,
      objectTypeId: el.objectTypeId,
      mimeType: el.contentType,
      allowableActions: el.allowableActions,
      defaultChoice: 'select'
    }, null, {
      permissions : false,
      history : isAbleToViewHistory && el['cmis:objectTypeId'] === 'D:cvpeople:attachment_elenco_prodotti_scelti' ? function () {
        var dateFormat = "DD/MM/YYYY HH:mm",
          content = $('<div></div>').addClass('modal-inner-fix'),
          table = $('<table class="table table-striped"></table>').appendTo(content),
          tbody = $('<tbody class="list"></tbody>').appendTo(table),
          versioni = new Search({
            dataSource: function () {
              return URL.Data.search.version({
                queue: true,
                data: {
                  nodeRef: el['cmis:objectId']
                }
              });
            },
            display : {
              row : function (el, refreshFn, permission) {
                var tr = $('<tr>'),
                  isMajorVersion = el['cmis:isMajorVersion'],
                  labelClass = isMajorVersion ? 'label-important' : 'label-info';
                tr.appendTo(tbody).append($('<td>').append('<b>Versione </b>')
                  .append($('<a class="label ' + labelClass + ' versionLabel">').on('click', function (event) {
                    window.location = URL.urls.search.content + '?nodeRef=' + el['cmis:objectId'];
                    return false;
                  })
                     .append(el['cmis:versionLabel']))
                  .append($('<span class="lastModificationDate">')
                     .append(' aggiornata il ' + CNR.Date.format(el['cmis:lastModificationDate'], '-', dateFormat)))
                  .append($('<span class="contentStreamLength">')
                     .append(' di dimensione ' + CNR.fileSize(el.contentStreamLength)))
                  );
              }
            }
          });
          new Criteria().list(versioni);
          UI.modal('<i class="icon-list-alt"></i> Versioni precedenti', content);
      } : false,
      copy: false,
      cut: false,
      move : isMoveable ? function () {
        UI.confirm('Sei sicuro di voler spostare il prodotto "' +  el['cvpeople:titolo']  + '" nella sezione "' + i18n.affix_tabElencoProdotti + '"?', function () {
          moveProdotto(el, refreshFn, refreshFnProdotti);
        });
      } : false,
      remove: function () {
        UI.confirm('Sei sicuro di voler eliminare il prodotto "' +  (el['cvpeople:titolo']||el['cmis:name'])  + '"?', function () {
          Node.remove(el.id, refreshFn);
        });
      },
      edit: function () {
        editProdotti(el, el['cvpeople:titolo']||el['cmis:name'], refreshFn);
      }
    }, {attachments : 'icon-download-alt', move : 'icon-road'}, refreshFn));
    return $('<tr></tr>')
      .append(tdText)
      .append(tdButton);
  }
  function displayProdotti(el, refreshFn, refreshFnProdottiScelti, isMoveable) {
    var tdText = headerProdotti(el),
      tdButton;
    tdButton = $('<td></td>').addClass('span2').append(ActionButton.actionButton({
      name: el.name,
      nodeRef: el.id,
      baseTypeId: el.baseTypeId,
      objectTypeId: el.objectTypeId,
      mimeType: el.contentType,
      allowableActions: el.allowableActions,
      defaultChoice: 'select'
    }, {copy_product: 'CAN_UPDATE_PROPERTIES'}, {
      permissions : false,
      history : false,
      copy: false,
      cut: false,
      update: false,
      move : isMoveable ? function () {
        UI.confirm('Sei sicuro di voler spostare il prodotto "' +  el['cvpeople:titolo']  + '" nella sezione "' + i18n.affix_tabProdottiScelti + '"?', function () {
          moveProdotto(el, refreshFn, refreshFnProdottiScelti);
        });
      } : false,
      remove: function () {
        UI.confirm('Sei sicuro di voler eliminare il prodotto "' +  (el['cvpeople:titolo']||el['cmis:name'])  + '"?', function () {
          Node.remove(el.id, refreshFn);
        });
      },
      edit: function () {
        editProdotti(el, el['cvpeople:titolo'], refreshFn);
      },
      copy_product: function () {
        el.addAspect = 'P:cvpeople:noSelectedProduct';
        editProdotti(el, el['cvpeople:titolo'], refreshFn, true);
      }
    }, {move : 'icon-road', copy_product: 'icon-copy'}, refreshFn));
    return $('<tr></tr>')
      .append(tdText)
      .append(tdButton);
  }

  function getTypeForDropDown(propertyName, properties, title, refreshFn, move, aspect) {
    var curriculumAttachments = completeList(
      properties[propertyName],
      cache.jsonlistApplicationCurriculums.concat(cache.jsonlistApplicationSchedeAnonime)
    ), dropdowns = {};
    curriculumAttachments = $.grep(curriculumAttachments, function (elem) {
      return elem.key !== properties.objectTypeId;
    });
    $.each(curriculumAttachments, function (index, el) {
      var newObjectTypeId = el.key, label = el.defaultLabel;
      dropdowns[label] = function () {
        new BulkInfo({
          handlebarsId: 'hash',
          path: properties.objectTypeId,
          metadata: properties
        }).handlebars().done(function (html) {
          if (aspect) {
            properties.addAspect = aspect;
          }
          editProdotti(properties, title, refreshFn, true, newObjectTypeId, html, move);
        });
      };
    });
    return dropdowns;
  }

  function displayCurriculum(el, refreshFn, i18nLabelsObj, aspect, sezione) {
    var tdText,
      tdButton,
      title = el['cvelement:denominazioneIncarico'] ||
        el['cvelement:denominazioneIstituto'] ||
        el['cvelement:titoloProgetto'] ||
        el['cvelement:denominazioneStruttura'] ||
        el['cvelement:rivista'] ||
        el['cvelement:tipologiaOrganismo'] ||
        el['cvelement:titoloEvento'] ||
        el['cvelement:descrizionePremio'] ||
        el['cvelement:descrizionePremio'] ||
        el['jconon_attachment:esperienza_professionale_datore_lavoro'] ||
        el['jconon_attachment:aspect_specializzazioni_universita'] ||
        el['jconon_attachment:precedente_incarico_oiv_amministrazione']||
        el['cvelement:concorso_pubblico_cnr_codice']||
        el['cvelement:concorso_pubblico_altro_ente_denominazione']||
        el['cvelement:commonSedeCNRDescrizione']||
        el['cvelement:commonAltroEnteCodice']||
        el['jconon_record:interruzioni_carriera_motivazione']||
        el['jconon_record:part_time_quota'],
      ruolo = el['cvelement:ruoloIncarico'] ||
        el['cvelement:ruoloProgetto'] ||
        el['jconon_attachment:esperienza_professionale_ruolo'] ||
        el['jconon_attachment:precedente_incarico_oiv_ruolo'],
      corso = el['cvelement:tipologiaCorso'] ||
        el['cvelement:abilitazioneProfessionale'] ||
        el['cvelement:congressoIstituzione'] ||
        el['cvelement:congresso'],
      materia = el['cvelement:materiaInsegnamento'] ||
        el['cvelement:alboIscrizione'] ||
        el['cvelement:sede'] ||
        el['cvelement:istituzioneAssegnataria'] ||
        el['jconon_attachment:aspect_specializzazioni_tipologia'],
      periodo = el['cvelement:periodAttivitaDal'] ||
        el['cvelement:periodAttivitaAl'] ||
        el['cvelement:attivitainCorso'],
      esperienza = el['jconon_attachment:esperienza_professionale_da'] ||
        el['jconon_attachment:esperienza_professionale_a'],
      item,
      typeLabel = i18nLabelsObj && i18nLabelsObj[el.objectTypeId] ? i18nLabelsObj[el.objectTypeId].newLabel : i18n[el.objectTypeId],
      annotationObjectType = $('<span class="annotation"><strong>' + typeLabel + '</strong></span>'),
      annotationPeriodo = $('<span class="muted annotation"><strong>Periodo di attività: </strong>' +
        (el['cvelement:periodAttivitaDal'] ? ('dal ' + CNR.Date.format(el['cvelement:periodAttivitaDal'], null, 'DD/MM/YYYY')) : '') +
        (el['cvelement:periodAttivitaAl'] ? (' al ' + CNR.Date.format(el['cvelement:periodAttivitaAl'], null, 'DD/MM/YYYY')) : '') +
        (el['cvelement:attivitainCorso'] ? ' in Corso' : '') +
        '</span>'),
      annotationPeriodoEsperienza = $('<span class="muted annotation"><strong>Periodo di attività: </strong>' +
        (el['jconon_attachment:esperienza_professionale_da'] ? ('dal ' + CNR.Date.format(el['jconon_attachment:esperienza_professionale_da'], null, 'DD/MM/YYYY')) : '') +
        (el['jconon_attachment:esperienza_professionale_a'] ? (' al ' + CNR.Date.format(el['jconon_attachment:esperienza_professionale_a'], null, 'DD/MM/YYYY')) : '') +
        '</span>'),
      annotationRuolo = $('<span class="muted annotation"><strong>Ruolo:</strong> ' + ruolo  + '</span>'),
      annotationCorso = $('<span class="muted annotation"> ' + corso  + '</span>'),
      annotationMateria = $('<span class="muted annotation"> ' + materia  + '</span>'),
      annotationAtto = $('<span class="muted annotation"><strong>' +
        (el['cvelement:attoConferimento'] === 'Non_disponibile' ? 'Atto non disponibile' : (el['cvelement:altroAttoConferimento'] || el['cvelement:attoConferimento'])) +
         '</strong> ' +
        (el['cvelement:numeroRiferimento'] || '') +
        (el['cvelement:dataRiferimento'] ? (' del ' + CNR.Date.format(el['cvelement:dataRiferimento'], null, 'DD/MM/YYYY')) : '') +
        '</span>');
    if (!title) {
        var key = Object.keys(el).filter(function(keys) {
          return keys.endsWith('universita') || keys.endsWith('amministrazione');
        })[0];
        if (key) {
            title = el[key];
        }
    }
    item = $('<a href="#">' + title + '</a>').on('click', function () {
        Node.displayMetadata(el.objectTypeId, el.id, true);
        return false;
    });
    if (periodo) {
      item.after(annotationPeriodo);
    }
    if (esperienza) {
      item.after(annotationPeriodoEsperienza);      
    }
    if (corso) {
      item.after(annotationCorso);
    }
    if (materia) {
      item.after(annotationMateria);
    }
    if (ruolo) {
      item.after(annotationRuolo);
    }
    if (el['cvelement:attoConferimento']) {
      item.after(annotationAtto);
    }

    tdText = $('<td></td>')
      .addClass('span10')
      .append(annotationObjectType)
      .append(item);
    tdButton = $('<td></td>').addClass('span2').append(ActionButton.actionButton({
      name: el.name,
      nodeRef: el.id,
      baseTypeId: el.baseTypeId,
      objectTypeId: el.objectTypeId,
      mimeType: el.contentType,
      allowableActions: el.allowableActions,
      defaultChoice: 'select'
    }, {copy_curriculum: 'CAN_UPDATE_PROPERTIES'}, {
      permissions : false,
      history : false,
      copy: false,
      cut: false,
      update: false,
      remove: function () {
        UI.confirm('Sei sicuro di voler eliminare la riga "' +  title  + '"?', function () {
          Node.remove(el.id, refreshFn);
        });
      },
      edit: function () {
        editProdotti(el, title, refreshFn);
      },
      copy_curriculum: function () {
        el.addAspect = aspect;
        editProdotti(el, title, refreshFn, true);
      },
      paste_row: getTypeForDropDown(sezione, el, title, refreshFn, false, aspect),
      move: getTypeForDropDown(sezione, el, title, refreshFn, true, aspect)
    }, {copy_curriculum: 'icon-copy', paste_row: 'icon-paste', move: 'icon-move'}, refreshFn));
    return $('<tr></tr>')
      .append(tdText)
      .append(tdButton);
  }

  function displaySchedaAnonima(el, refreshFn) {
    var tdText,
      tdButton,
      title = el['jconon_scheda_anonima:dottorato_di_ricerca_denominazione'] ||
        el['jconon_scheda_anonima:common_contratto_denominazione_ente'] ||
        el['jconon_scheda_anonima:istituto_laurea']||
        el['jconon_attachment:esperienza_professionale_datore_lavoro'] ||
        el['jconon_attachment:aspect_specializzazioni_universita'] ||
        el['jconon_attachment:precedente_incarico_oiv_amministrazione'],
      periodo = el['jconon_scheda_anonima:common_contratto_data_inizio'] ||
        el['jconon_scheda_anonima:common_contratto_data_fine'] ||
        el['jconon_scheda_anonima:common_contratto_incorso'],
      item = $('<a href="#">' + title + '</a>').on('click', function () {
        Node.displayMetadata(el.objectTypeId, el.id, true);
        return false;
      }),
      annotationObjectType = $('<span class="annotation"><strong>' + i18n[el.objectTypeId] + '</strong></span>'),
      annotationPeriodo = $('<span class="muted annotation"><strong>Periodo di attività: </strong>' +
        (el['jconon_scheda_anonima:common_contratto_data_inizio'] ? ('dal ' + CNR.Date.format(el['jconon_scheda_anonima:common_contratto_data_inizio'], null, 'DD/MM/YYYY')) : '') +
        (el['jconon_scheda_anonima:common_contratto_data_fine'] ? (' al ' + CNR.Date.format(el['jconon_scheda_anonima:common_contratto_data_fine'], null, 'DD/MM/YYYY')) : '') +
        (el['jconon_scheda_anonima:common_contratto_incorso'] ? ' in Corso' : '') +
        '</span>');
    if (periodo) {
      item.after(annotationPeriodo);
    }

    tdText = $('<td></td>')
      .addClass('span10')
      .append(annotationObjectType)
      .append(item);
    tdButton = $('<td></td>').addClass('span2').append(ActionButton.actionButton({
      name: el.name,
      nodeRef: el.id,
      baseTypeId: el.baseTypeId,
      objectTypeId: el.objectTypeId,
      mimeType: el.contentType,
      allowableActions: el.allowableActions,
      defaultChoice: 'select'
    }, {copy_curriculum: 'CAN_UPDATE_PROPERTIES'}, {
      permissions : false,
      history : false,
      copy: false,
      cut: false,
      update: false,
      remove: function () {
        UI.confirm('Sei sicuro di voler eliminare la riga "' +  title  + '"?', function () {
          Node.remove(el.id, refreshFn);
        });
      },
      edit: function () {
        editProdotti(el, title, refreshFn);
      },
      copy_curriculum: function () {
        editProdotti(el, title, refreshFn, true);
      },
      paste_row: getTypeForDropDown('jconon_call:elenco_schede_anonime', el, title, refreshFn),
      move: getTypeForDropDown('jconon_call:elenco_schede_anonime', el, title, refreshFn, true)
    }, {copy_curriculum: 'icon-copy', paste_row: 'icon-paste', move: 'icon-move'}, refreshFn));
    return $('<tr></tr>')
      .append(tdText)
      .append(tdButton);
  }

  function peopleBaseCriteria(dataPeopleUser) {
    var criteria = new Criteria();
    criteria.like('prodotti:autoricnr_login',  dataPeopleUser.userName);
    return criteria;
  }
  function peopleMapping(type, applicationId, aspect, mapping, doc) {
    mapping.objectTypeDisplayName = doc['cmis:objectTypeDisplayName'] !== undefined ? doc['cmis:objectTypeDisplayName'] : null;
    mapping.titolo = doc['prodotti:titolo'];
    mapping.autori = doc['prodotti:autori'];
    mapping.affiliazioni = doc['prodotti:affiliazioni'];
    mapping.tipo = doc['prodotti:id_tipo_txt'];
    mapping.anno = doc['prodotti:anno'];
    mapping.folderAttachName = doc['cmis:name'] + '_attaches';
    mapping.jconontype = type;
    mapping.applicationId = applicationId;
    mapping.aspect = aspect;
    return mapping;
  }
  /* Revealing Module Pattern */
  return {
    displayProdottiScelti: displayProdottiScelti,
    displayProdotti: displayProdotti,
    displayCurriculum: displayCurriculum,
    displaySchedaAnonima: displaySchedaAnonima,
    getTypeForDropDown: getTypeForDropDown,
    editProdotti: editProdotti,
    punteggi: punteggi,
    displayTitoli : function (el, refreshFn, i18nLabelsObj) {
      return jconon.defaultDisplayDocument(el, refreshFn, false, undefined, undefined, undefined, undefined, undefined, i18nLabelsObj);
    },
    completeList: completeList,
    remove: function (objectId, callback) {
      UI.confirm(i18n.prop('message.delete.application.question'), function () {
        var close = UI.progress();
        jconon.Data.application.main({
          type: 'DELETE',
          placeholder: {
            'cmis:objectId': objectId
          },
          success: function () {
            UI.success(i18n['message.operation.performed'], function () {
              if (callback) {
                callback();
              }
            });
          },
          complete: close,
          error: URL.errorFn
        });
      });
    },
    send: function (data, callback) {
      var close = UI.progress();

      jconon.Data.application.send({
        type: 'POST',
        data: data,
        success: function (data) {
          UI.success(i18n.prop('message.conferma.application.done', data.email_comunicazione), function () {
            if (callback) {
              callback();
            }
          });
        },
        complete: close,
        error: jconon.error
      });
    },
    print: function (applicationId, stato, bandoInCorso, dataDomanda) {
      URL.Data.search.query({
        queue: true,
        data: {
          q: "select cmis:objectId, cmis:lastModificationDate, cmis:versionLabel from jconon_attachment:application where IN_FOLDER ('" + applicationId + "')"
        }
      }).done(function (rs) {

        function print() {
          UI.confirm(i18n['message.print.application'], function () {
            jconon.Data.application.print({
              type: 'GET',
              placeholder: {
                nodeRef: applicationId
              },
              error: jconon.error
            });
          });
        }

        if (rs.totalNumItems === 0) {
          if (bandoInCorso) {
            print();
          } else {
            UI.error("Non esiste alcuna stampa disponibile!");
          }
        } else {
          var newPrint = $('<button class="btn" data-dismiss="modal">Nuova stampa</button>'),
            historyBtn = $('<button class="btn btn-success" data-dismiss="modal" title="Storico Domande"><i class="icon-list-alt"></i> Storico Domande</button>'),
            btnPrimary,
            m = UI.modal('Stampa domanda', 'E\' disponibile la stampa versione ' +
              rs.items[0]['cmis:versionLabel'] + (dataDomanda ? ' confermata il ' : ' eseguita il ') +
                CNR.Date.format(dataDomanda || rs.items[0]['cmis:lastModificationDate'], null, 'DD/MM/YYYY H:mm'), function () {
                window.location = 'search/content?nodeRef=' + rs.items[0]['cmis:objectId'];
              });
          btnPrimary = m.find(".modal-footer").find(".btn-primary");
          btnPrimary.text("Visualizza");
          if ((stato === 'P' || stato === 'I') && bandoInCorso) {
            btnPrimary.after(newPrint);
            newPrint.click(function () {
              print();
            });
          }
          btnPrimary.after(historyBtn);
          historyBtn.click(function () {
            var dateFormat = "DD/MM/YYYY HH:mm",
              content = $('<div></div>').addClass('modal-inner-fix'),
              table = $('<table class="table table-striped"></table>').appendTo(content),
              tbody = $('<tbody class="list"></tbody>').appendTo(table), 
              versioni = new Search({
                dataSource: function () {
                  return URL.Data.search.version({
                    queue: true,
                    data: {
                      nodeRef: rs.items[0]['cmis:objectId']
                    }
                  });
                },
                display : {
                  row : function (el, refreshFn, permission) {
                    var tr = $('<tr>'),
                      isMajorVersion = el['cmis:isMajorVersion'],
                      labelClass = isMajorVersion ? 'label-important' : 'label-info';
                    tr.appendTo(tbody).append($('<td>').append('<b>Versione </b>')
                      .append($('<a class="label ' + labelClass + ' versionLabel">').on('click', function (event) {
                        window.location = URL.urls.search.content + '?nodeRef=' + el['cmis:objectId'];
                        return false;
                      })
                         .append(el['cmis:versionLabel']))
                      .append($('<span class="lastModificationDate">')
                         .append(' aggiornata il ' + CNR.Date.format(el['cmis:lastModificationDate'], '-', dateFormat)))
                      .append($('<span class="contentStreamLength">')
                         .append(' di dimensione ' + CNR.fileSize(el.contentStreamLength)))
                      );                    
                  }
                }
              });
              new Criteria().list(versioni);
              UI.modal('<i class="icon-list-alt"></i> Versioni precedenti', content);
          });
        }
      });
    },
    reopen: function (data, callback) {
      UI.confirm(i18n.prop('message.jconon_application_dichiarazione_riapertura_domanda'), function () {
        var close = UI.progress();
        jconon.Data.application.reopen({
          type: 'POST',
          data: data,
          success: function () {
            UI.success(i18n['message.operation.performed'], function () {
              if (callback) {
                callback();
              }
            });
          },
          complete: close,
          error: jconon.error
        });
      });
    },
    people : function (type, applicationId, aspect, refreshFn, dataPeopleUser) {
      /*jslint unparam: true*/
      var modal,
        content = $('<div></div>').addClass('modal-inner-fix'),
        pagination = $('<div class="pagination pagination-centered"><ul></ul></div>'),
        displayTable = $('<table class="table table-striped"></table>'),
        searchPanel = $('<div class="input-append"></div>'),
        nresults = $('<span class="muted"><span>'),
        query = $('<input type="text" placeholder="' + i18n['people.placeholder.search'] + '" class="span6">')
          .appendTo(searchPanel),
        orderBy = $('<div id="orderBy" class="btn-group">' +
                '<a class="btn dropdown-toggle" data-toggle="dropdown" href="#">' + i18n['button.order.by'] +
                '<span class="caret"></span></a><ul class="dropdown-menu"></ul></div>').appendTo(displayTable).after(nresults),
        emptyResultset = $('<div class="alert"></div>').hide().append(i18n['label.count.no.document']),
        allegatiPeople = new Search({
          elements: {
            table: displayTable,
            pagination: pagination,
            label: emptyResultset,
            orderBy: orderBy
          },
          mapping: function (mapping, doc) {
            return peopleMapping(type, applicationId, aspect, mapping, doc);
          },
          fields: {
            'nome': null,
            'ID people': 'common_metadata.prodotti:id',
            'data di creazione': null,
            'Tipologia': 'prodotti:id_tipo',
            'Anno': 'prodotti:anno'
          },
          orderBy: [{
            field: 'prodotti:anno',
            asc: true
          }],
          type: 'prodotti:prodotto join prodotti:common_metadata AS common_metadata on common_metadata.cmis:objectId = cmis:objectId',
          columns: [
            'prodotti:titolo',
            'prodotti:autori',
            'prodotti:affiliazioni',
            'prodotti:id_tipo_txt',
            'prodotti:anno'
          ],
          dataSource: function (page, settings, getUrlParams) {
            return jconon.Data.people.query({
              queue: true,
              data: getUrlParams(page),
              errorFn: function (jqXHR, textStatus, errorThrown) {
                UI.error('Il sistema People non è al momento raggiungibile');
              }
            });
          },
          maxItems: 10,
          display : {
            row : peopleDisplayDocument,
            after : function (documents) {
              modal.find('#myModalLabel').text(i18n['title.prodotti.people'] + ' ' +
                i18n.prop('title.num.prodotti.people', documents.totalNumItems));

              query.val('')
                .attr("disabled", true)
                .tooltip({
                  html: true,
                  title: 'Effettua la ricerca su <u>tutti</u> i campi.'
                });

              nresults.text('');

              var searchjs = new Search({
                  type: allegatiPeople.changeType(),
                  dataSource: function (page, settings, getUrlParams) {
                    return jconon.Data.people.query({
                      queue: true,
                      data: getUrlParams(page),
                      errorFn: function (jqXHR, textStatus, errorThrown) {
                        UI.error('Il sistema People non è al momento raggiungibile');
                      }
                    });
                  },
                  columns: [
                    'prodotti:titolo',
                    'prodotti:autori',
                    'prodotti:affiliazioni',
                    'prodotti:id_tipo_txt',
                    'prodotti:anno'
                  ],
                  orderBy: false,
                  fetchCmisObject: false,
                  mapping: function (mapping, doc) {
                    return peopleMapping(type, applicationId, aspect, mapping, doc);
                  },
                  disableRequestReplay: 'sub_' + allegatiPeople.changeType() + '_',
                  maxItems: 1000,
                  display: {
                    after: function (documents, unused, resultSetx) {
                      query.searchjs({
                        content: documents.items,
                        engine: {
                          logger: false,
                          allowed: function (key) {
                            if (key === 'cmis:name' || !/^cmis/g.test(key)) {
                              return true;
                            }
                          }
                        },
                        display: function (resultSet) {
                          nresults.text('');
                          displayTable.find('tbody tr').remove();
                          $.each(resultSet, function (index, el) {
                            var item = resultSetx[el],
                              tr = peopleDisplayDocument(item, refreshFn);
                            displayTable.append(tr);
                          });
                          pagination.hide();
                          if (query.val().trim().length === 0 && typeof refreshFn === 'function') {
                            peopleBaseCriteria(dataPeopleUser).list(allegatiPeople);
                          } else {
                            nresults.text(' ' + resultSet.length + ' ' + (resultSet.length === 1 ? 'elemento trovato' : 'elementi trovati'));
                          }
                        }
                      });
                    }
                  }
                });
              peopleBaseCriteria(dataPeopleUser).list(searchjs);
            }
          }
        });
      /*jslint unparam: false*/

      orderBy.appendTo(searchPanel);
      content
        .append(searchPanel)
        .append(displayTable)
        .append(pagination)
        .append(emptyResultset);
      /*common.User.matricola 5792*/
      peopleBaseCriteria(dataPeopleUser).list(allegatiPeople);
      modal = UI.bigmodal(i18n['title.prodotti.people'], content, undefined, function () {
        refreshFn();
      });
    }
  };
});