
/* javascript closure providing all the search functionalities */
define(['jquery', 'cnr/cnr', 'i18n', 'cnr/cnr.actionbutton', 'json!common', 'handlebars',
  'cnr/cnr.validator', 'cnr/cnr.url', 'cnr/cnr.ui', 'cnr/cnr.jconon', 'cnr/cnr.url',
  'cnr/cnr.ace', 'cnr/cnr.ui.authority', 'cnr/cnr.search', 'cnr/cnr.criteria', 'cnr/cnr.bulkinfo', 'cnr/cnr.ui.checkbox', 'json!cache', 'searchjs'
  ], function ($, CNR, i18n, ActionButton, common, Handlebars, validator, cnrurl, UI, jconon, URL, Ace, Authority, Search, Criteria, BulkInfo, Checkbox, cache) {
  "use strict";
  //Creare un cnr.group dove spostare le funzione comune a cnr.explorer
  function addChild(parent, groupDescription, child, callback) {
    URL.Data.proxy.childrenGroup({
      type: 'POST',
      data: JSON.stringify({
        'parent_group_name': parent,
        'child_name': child
      }),
      contentType: 'application/json'
    }).done(function () {
      UI.success(child + ' aggiunto al gruppo ' + groupDescription);
      callback();
    }).fail(function () {
      UI.error("impossibile aggiungere " + child + " al gruppo " + groupDescription);
    });
  }

  function isCommissario(jconon_call_commissione) {
    return common.User.groups && common.User.groups.indexOf("GROUP_" + jconon_call_commissione) !== -1;
  }

  function isRdP(jconon_call_rdp) {
    return common.User.groups && common.User.groups.indexOf("GROUP_" + jconon_call_rdp) !== -1;
  }

  function remove(codice, id, objectTypeId, callback) {
    UI.confirm(i18n.prop('label.call.confirm.delete', codice), function () {
      var close = UI.progress();
      jconon.Data.call.main({
        type: 'DELETE',
        placeholder: {
          'cmis:objectId': id,
          "cmis:objectTypeId" : objectTypeId
        },
        success: function (data) {
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
  }
  function publishCall(data, publish, callback) {
    var close = UI.progress();
    data.push({name: 'publish', value: publish});
    jconon.Data.call.publish({
      type: 'POST',
      data: data,
      success: function (data) {
        UI.success(i18n['message.operation.performed'], function () {
          if (callback) {
            var pubblicato = data.published,
              removeClass = pubblicato ? 'icon-eye-open' : 'icon-eye-close',
              addClass = pubblicato ? 'icon-eye-close' : 'icon-eye-open',
              title = pubblicato ? i18n['button.unpublish'] : i18n['button.publish'];
            callback(pubblicato, removeClass, addClass, title, data);
          }
        });
      },
      complete: close,
      error: URL.errorFn
    });
  }
  function isActive(inizio, fine) {
    var data_inizio = CNR.Date.parse(inizio),
      data_fine = CNR.Date.parse(fine),
      data_now = CNR.Date.parse(common.now);
    if (data_inizio <= data_now && data_fine >= data_now) {
      return true;
    }
    return false;
  }
  function filter(bulkInfo, search, method, type, value, attivi_scadutiValue) {
    var criteria = jconon.getCriteria(bulkInfo, attivi_scadutiValue);
    if (method) {
      criteria[method].call(null, type, value);
    }
    if (bulkInfo.getDataValueById('profilo') && search.changeType().indexOf('jconon_call:aspect_inquadramento') == -1) {
      search.changeType(jconon.joinQuery(search.changeType(), ['P:jconon_call:aspect_inquadramento'], undefined, 'root'));
    }
    if ((bulkInfo.getDataValueById('filter_numero_gu') || bulkInfo.getDataValueById('filter_data_gu')) && search.changeType().indexOf('jconon_call:aspect_gu') == -1) {
      search.changeType(jconon.joinQuery(search.changeType(), ['P:jconon_call:aspect_gu'], undefined, 'root'));
    }
    criteria.list(search);
  }
  function displayGroup(name, element, callback) {
    var groupName = "GROUP_" + name,
      specificSettings = {
        data: {
          shortName: name
        },
        success: function (data) {
          if (!data.nodeRef) {
            return false;
          }
          var parentNodeRef = data.nodeRef, groupDescription = data.authorityDisplayName;
          URL.Data.proxy.childrenGroup({
            data: {
              fullName: groupName
            },
            success: function (data) {
              var table = $('<table class="table table-striped"></table>'),
                tfoot = $('<tfoot><tr><td colspan="2"></td></tr></tfoot>');
              $.each(data, function (index, el) {
                var item = {
                  baseTypeId: el.attr.type,
                  allowableActions: el.attr.allowableActions,
                  nodeRef: el.attr.id,
                  name: el.data,
                  group: parentNodeRef,
                  authorityId: el.attr.authorityId
                },
                  isUser = el.attr.type === 'USER',
                  btn = ActionButton.actionButton(item, null, null, null, callback),
                  td = $('<td></td>').addClass('span10'),
                  row = $('<tr></tr>'),
                  a = $('<a href="#undefined">' + el.attr.displayName + '</a>').click(function () {
                    Ace.showMetadata(el.attr.authorityId);
                  });

                td.append('<i class="' + (isUser ? 'icon-user' : 'icon-group icon-blue') + '"></i> ')
                  .append(a)
                  .append('<span class="muted annotation">' + el.attr.shortName + '</span>');

                row
                  .append(td)
                  .append($('<td></td>').addClass('span2').append(btn));
                table.append(row);
              });
              tfoot.appendTo(table);
              tfoot.find('td')
                .append('<button type="button" class="btn btn-mini btn-primary create-acl">' +
                  '<i class="icon-resize-small"></i> Crea associazione</button>');
              element.append(table);
              table.find('.create-acl').off('click').on('click', function () {
                var widget = Authority.Widget("username", null);
                UI.modal("Seleziona utente/gruppo", widget, function () {
                  addChild(groupName, groupDescription, widget.data('value'), callback);
                });
              });
              table.find('.permissions').off('click').on('click', function () {
                Ace.panel(parentNodeRef, null, ["FullControl", "Read", "Write"]);
              });
            }
          });
        }
      };
    if (name !== "") {
      URL.Data.proxy.group(specificSettings);
    }
  }
  function groupHelpDesk(idCategoria, element, callback) {
    var table = $('<table class="table table-striped categoria-' + idCategoria + '"></table>'),
      tbody = $('<tbody></tbody>'),
      tfoot = $('<tfoot><tr><td colspan="2"></td></tr></tfoot>');
    jconon.Data.helpdesk.esperti({
      data: {
        idCategoria: idCategoria
      },
      success: function (data) {
        table.append(tbody);
        $.each(data, function (index, el) {
          var btn = $('<button type="button" class="btn btn-mini btn-danger"><i class="icon-resize-full">' +
            '</i> Rimuovi associazione</button>').
            off('click').on('click', function () {
              jconon.Data.helpdesk.esperti({
                type: 'DELETE',
                placeholder: {
                  idCategoria: idCategoria,
                  idEsperto: el.login
                },
                success: function (data) {
                  callback();
                }
              });
            }),
            td = $('<td></td>').addClass('span10'),
            row = $('<tr></tr>'),
            a = $('<a href="#undefined">' + el.login + '</a>').click(function () {
              Ace.showMetadata(el.login);
            });

          td.append('<i class="icon-user"></i> ')
            .append(a)
            .append('<span class="muted annotation" style="text-transform:capitalize">' + el.firstName  + ' ' + el.familyName + '</span>');

          row
            .append(td)
            .append($('<td></td>').addClass('span3').append(btn));
          tbody.append(row);
        });
      }
    });
    tfoot.appendTo(table);
    tfoot.find('td')
      .append('<button type="button" class="btn btn-mini btn-primary create-acl">' +
        '<i class="icon-resize-small"></i> Crea associazione</button>');
    element.append(table);
    table.find('.create-acl').off('click').on('click', function () {
      var widget = Authority.Widget("username", null, {jsonsettings: {usersOnly: true}});
      UI.modal("Seleziona utente", widget, function () {
        jconon.Data.helpdesk.esperti({
          type: 'PUT',
          placeholder: {
            idCategoria: idCategoria,
            idEsperto: widget.data('value')
          },
          success: function (data) {
            callback();
          }
        });
      });
    });
  }

  function manageGroup(name, content) {
    displayGroup(name, content, function () {
      content.find('table.table-striped').remove();
      manageGroup(name, content);
    });
  }
  function callActiveCriteria(callTypeId, callId, cmisParentId, filterAll) {
    var criteria = new Criteria();
    criteria.lte('jconon_call:data_inizio_invio_domande', common.now, 'date');
    criteria.gte('jconon_call:data_fine_invio_domande', common.now, 'date');
    criteria.notEq('cmis:objectId', callId, 'string');
    if (cmisParentId && !filterAll) {
      criteria.inFolder(cmisParentId, 'canSubmit');
    }
    return criteria;
  }

  function displayAttachments(id) {

    var content = $('<div></div>').addClass('modal-inner-fix');
    jconon.findAllegati(id, content, 'jconon_attachment:document', null, function (el, refreshFn, permission) {
      return jconon.defaultDisplayDocument(el, refreshFn, permission, false);
    });

    UI.modal(i18n['actions.attachments'], content);

  }

  function scaricaSchedeValutazione(el, idMessage, format) {
    UI.confirm(i18n.prop(idMessage, el['jconon_call:codice']), function () {
      var close = UI.progress();
      jconon.Data.application.exportSchedeValutazione({
        placeholder: {
          "id" : el.id,
          "format" : format
        },
        success: function (data) {
          var downlod = $("<a data-dismiss='modal' aria-hidden='true' href='#'> Download </a>").click(function () {
            window.location = cache.baseUrl + data.url;
          });
          UI.success($("<div>File creato correttamente: </div>").append(downlod));
        },
        complete: close
      });
    });
  }

  function displayRow(bulkInfo, search, typeId, rootTypeId, resultSet, target, isForCopyApplication) {
    var xhr = new BulkInfo({
      target: $('<tbody>').appendTo(target),
      handlebarsId: 'call-main-results',
      path: typeId,
      metadata: resultSet,
      handlebarsSettings: {
        call_type: typeId === rootTypeId ? true : false
      }
    }).handlebars();

    xhr.done(function () {
      target.off('click').on('click', '.requirements', function (e) {
        var data = $("<div></div>").addClass('modal-inner-fix').html($(this).data('content'));
        UI.modal('<i class="icon-info-sign text-info animated flash"></i> ' + i18n['label.th.jconon_bando_elenco_titoli_studio'], data);
        return e.preventDefault();
      });

      var rows = target.find('tbody tr'),
        customButtons = {
          select: false
        }, dropdownSchedaValutazione = {}, dropdownSchedaAnonima = {}, dropdownConvocazioni = {};
      $.each(resultSet, function (index, el) {
        var secondaryObjectTypeIds = el['cmis:secondaryObjectTypeIds'] || el.aspect,
          isMacroCall = secondaryObjectTypeIds === null ? false : secondaryObjectTypeIds.indexOf('P:jconon_call:aspect_macro_call') >= 0,
          row,
          azioni;
        if (isForCopyApplication) {
          customButtons.paste = function () {
            UI.confirm(i18n.prop('message.jconon_application_copia_domanda', el['jconon_call:codice']), function () {
              var close = UI.progress();
              jconon.Data.application.paste({
                type: 'POST',
                data: {
                  "applicationSourceId": el.applicationId,
                  "callTargetId": el.id
                },
                success: function (data) {
                  window.location = jconon.URL.application.manage + '?callId=' + el.id + '&applicationId=' + data['cmis:objectId'];
                },
                complete: close
              });
            });
          };
        } else {
          customButtons.attachments = function () {
            displayAttachments(el.id);
          };
          customButtons.edit = function () {
            window.location = jconon.URL.call.manage + '?call-type=' + el.objectTypeId + '&cmis:objectId=' + el.id;
          };
          customButtons.listApplication = function () {
            window.location = jconon.URL.application.list + '?cmis:objectId=' + el.id;
          };
          customButtons.application = !isMacroCall &&
            (isActive(el.data_inizio_invio_domande, el.data_fine_invio_domande) || el.data_fine_invio_domande === null) ? function () {
              window.location = jconon.URL.application.manage + '?callId=' + el.id;
            } : false;
          customButtons.detail = !isMacroCall ? false : function () {
            filter(bulkInfo, search, 'equals', 'root.cmis:parentId', el.id);
          };
          customButtons.remove = function () {
            remove(el.codice, el.id, el.objectTypeId, function () {
              filter(bulkInfo, search);
            });
          };
          if (common.User.isAdmin) {
            customButtons.permissions = function () {
              Ace.panel(el['alfcmis:nodeRef'] || el['cmis:objectId'], el.name, null, false);
            };
          } else {
            customButtons.permissions = false;
          }
          customButtons.publish = function () {
            var that =  $(this),
              published = el['jconon_call:pubblicato'],
              message = published ? i18n['message.action.unpublish'] : i18n['message.action.publish'];
            UI.confirm(message, function () {
              publishCall([
                {name: 'cmis:objectId', value: el.id},
                {name: 'cmis:objectTypeId', value: el.objectTypeId},
                {name: 'skip:save', value: true}
              ], !published, function (pubblicato, removeClass, addClass, title) {
                el['jconon_call:pubblicato'] = pubblicato;
                that.find('i')
                  .removeClass(removeClass)
                  .addClass(addClass);
              });
            });
          };
          customButtons.commission = isActive(el.data_inizio_invio_domande, el.data_fine_invio_domande) ? false : function () {
            var content = $('<div></div>').addClass('modal-inner-fix');
            manageGroup(el['jconon_call:commissione'], content);
            UI.modal('Modifica Commissione', content);
          };
          customButtons.groupRdP = function () {
            var content = $('<div></div>').addClass('modal-inner-fix');
            manageGroup(el['jconon_call:rdp'], content);
            UI.modal('Modifica RdP', content);
          };
          customButtons.exportApplications = function () {
            UI.confirm(i18n.prop('message.jconon_application_zip_domande', el['jconon_call:codice']), function () {
              var close = UI.progress();
              jconon.Data.application.exportApplications({
                /*data: {
                  "deleteFinalFolder": true
                },*/
                placeholder: {
                  "store_type" : 'workspace',
                  "store_id" : 'SpacesStore',
                  "id" : el.id
                },
                success: function (data) {
                  var downlod = $("<a data-dismiss='modal' aria-hidden='true' href='#'> Download </a>").click(function () {
                    window.location = cache.baseUrl + data.url;
                  });
                  UI.success($("<div>File creato correttamente: </div>").append(downlod));
                },
                complete: close
              });
            });
          };
          if (el['jconon_call:scheda_valutazione'] === true && !isActive(el.data_inizio_invio_domande, el.data_fine_invio_domande) &&
              (common.User.isAdmin || isCommissario(el['jconon_call:commissione']) || isRdP(el['jconon_call:rdp']))) {
            if (common.User.isAdmin || isRdP(el['jconon_call:rdp'])) {
              dropdownSchedaValutazione['Estrai tutte le schede'] = function () {
                UI.confirm(i18n.prop('message.jconon_application_estrai_schede', el['jconon_call:codice'], common.User.email), function () {
                  jconon.Data.application.generaSchedeValutazione({
                    placeholder: {
                      "id" : el.id,
                      "email" : common.User.email
                    }
                  });
                });
              };
            }
            if (common.User.isAdmin || isCommissario(el['jconon_call:commissione'])) {
              dropdownSchedaValutazione['Scarica le schede come ZIP'] = function () {
                scaricaSchedeValutazione(el, 'message.jconon_application_zip_schede', 'zip');
              };
              dropdownSchedaValutazione['Scarica le schede come XLS'] = function () {
                scaricaSchedeValutazione(el, 'message.jconon_application_xls_schede', 'xls');
              };
            }
            customButtons.scheda_valutazione = dropdownSchedaValutazione;
          }
          if (el['jconon_call:scheda_anonima_sintetica'] === true && el['jconon_call:stato'] !== 'PROCESSO_SCHEDE_ANONIME_CONCLUSO' && !isActive(el.data_inizio_invio_domande, el.data_fine_invio_domande) &&
              (common.User.isAdmin || isCommissario(el['jconon_call:commissione']) || isRdP(el['jconon_call:rdp']))) {
            if (common.User.isAdmin || isRdP(el['jconon_call:rdp'])) {
              dropdownSchedaAnonima['Estrai tutte le schede'] = function () {
                UI.confirm(i18n.prop('message.jconon_application_estrai_schede_anonime', el['jconon_call:codice'], common.User.email), function () {
                  jconon.Data.application.generaSchedeAnonime({
                    placeholder: {
                      "id" : el.id,
                      "email" : common.User.email
                    }
                  });
                });
              };
              dropdownSchedaAnonima['Concludi processo di valutazione'] = function () {
                UI.confirm(i18n.prop('message.jconon_application_concludi_processo_schede_anonime', el['jconon_call:codice']), function () {
                  var close = UI.progress();
                  jconon.Data.application.concludiProcessoSchedeAnonime({
                    placeholder: {
                      "id" : el.id
                    },
                    success: function (data) {
                      UI.success(data.message);
                    },
                    complete: close
                  });
                });
              };
              dropdownSchedaAnonima['Visualizza Schede'] = function () {
                window.location = jconon.URL.application.schede_anonime + '?cmis:objectId=' + el.id;
              };
              customButtons.scheda_anonima = dropdownSchedaAnonima;
            }
            if (isCommissario(el['jconon_call:commissione'])) {
              customButtons.scheda_anonima = function () {
                window.location = jconon.URL.application.schede_anonime + '?cmis:objectId=' + el.id;
              };
            }
          } else {
            customButtons.scheda_anonima = false;
          }

          if (!isActive(el.data_inizio_invio_domande, el.data_fine_invio_domande) &&
              (common.User.isAdmin || isRdP(el['jconon_call:rdp']))) {
            dropdownConvocazioni['Genera'] = function () {
              window.location = jconon.URL.call.convocazione.genera + '?callId=' + el.id;
            };
            dropdownConvocazioni['Visualizza'] = function () {
              window.location = jconon.URL.call.convocazione.visualizza + '?callId=' + el.id;
            };
            customButtons.convocazioni =  dropdownConvocazioni;
          } else {
            customButtons.convocazioni = false;
          }

          if (common.enableTypeCalls) {
            var copiaBando = {};
            $.each(common.enableTypeCalls, function (key, elType) {
              copiaBando[i18n.prop(elType.id, elType.title)] = function () {
                window.location = jconon.URL.call.manage + '?call-type=' + elType.id + '&copyFrom=' + el.id;
              };
            });
            customButtons.copia_bando = copiaBando;
          }
          customButtons.copy = false;
          customButtons.cut = false;
        }
        azioni = new ActionButton.actionButton({
          name: el.name,
          nodeRef: el.id,
          baseTypeId: el.baseTypeId,
          objectTypeId: el.objectTypeId,
          mimeType: el.contentType,
          allowableActions: el.allowableActions,
          defaultChoice: isMacroCall ? 'detail' : 'application'
        }, {publish: 'CAN_APPLY_ACL', commission: 'CAN_APPLY_ACL', groupRdP : 'CAN_APPLY_ACL', listApplication: 'CAN_CREATE_DOCUMENT', exportApplications: 'CAN_CREATE_DOCUMENT'},
          customButtons, {
            application: 'icon-edit',
            detail: 'icon-sitemap',
            attachments : 'icon-download-alt',
            publish: el['jconon_call:pubblicato'] ? 'icon-eye-close' : 'icon-eye-open',
            commission: 'icon-group',
            groupRdP: 'icon-user',
            listApplication: 'icon-folder-open-alt',
            exportApplications: 'icon-exchange',
            paste: 'icon-paste',
            scheda_valutazione: 'icon-table',
            scheda_anonima: 'icon-table',
            copia_bando: 'icon-copy',
            convocazioni: 'icon-inbox'
          });
        row = $(rows.get(index));
        if (!isMacroCall) {
          row
            .css('background-color', 'rgb(250, 254, 255)');
          //.find('td:first').css('padding-left', '30px');

        }
        azioni.appendTo(row.find('td:last'));
      });
    });
  }
  /* Revealing Module Pattern */
  return {
    remove: remove,
    publish: publishCall,
    isActive: isActive,
    filter: filter,
    displayGroup: displayGroup,
    groupHelpDesk: groupHelpDesk,
    displayRow : displayRow,
    displayAttachments: displayAttachments,
    isCommissario : isCommissario,
    isRdP : isRdP,
    loadLabels : function (callId) {
      return jconon.Data.call.loadLabels({
        data: {
          'cmis:objectId' : callId
        },
        success: function (data) {
          $.each(data, function (index, el) {
            i18n[index] = el;
          });
        }
      });
    },
    pasteApplication : function (applicationId, callTypeId, callId, hasMacroCall) {
      var modal,
        type = callTypeId.substring(2) +
          ' join jconon_call:can_submit_application AS canSubmit on ' +
          ' canSubmit.cmis:objectId = cmis:objectId',
        mandatoryAspects,
        aspectQuery,
        cmisParentId,
        activeCalls,
        content = $('<div></div>').addClass('modal-inner-fix'),
        pagination = $('<div class="pagination pagination-centered"><ul></ul></div>'),
        displayTable = $('<table class="table table-striped"></table>'),
        searchPanel = $('<div class="input-append"></div>'),
        nresults = $('<span class="muted"><span>'),
        query = $('<input type="text" placeholder="' + i18n['label.freesearch.placeholder'] + '" class="span6">')
          .appendTo(searchPanel),
        filterAllCall = Checkbox.Widget('filerAllCall', 'Visualizza tutti i bandi', {name : 'filterAllCall', val : true})
          .addClass('form-horizontal').on('setData', function (event, key, value) {
            callActiveCriteria(callTypeId, callId, cmisParentId, value).list(activeCalls);
          }),
        orderBy = $('<div id="orderBy" class="btn-group">' +
                '<a class="btn dropdown-toggle" data-toggle="dropdown" href="#">' + i18n['button.order.by'] +
                '<span class="caret"></span></a><ul class="dropdown-menu"></ul></div>').appendTo(displayTable).after(nresults),
        emptyResultset = $('<div class="alert"></div>').hide().append('nessun bando trovato'),
        columns = [],
        sortFields = {
          nome: null,
          'data di creazione': null
        },
        xhr = URL.Data.bulkInfo({
          placeholder: {
            path: callTypeId,
            kind: 'column',
            name: 'home'
          },
          data: {
            guest : true
          }
        });
      /*jslint unparam: true*/
      $.each(cache.jsonlistTypeWithMandatoryAspects, function (index, el) {
        if (el.key === callTypeId) {
          mandatoryAspects = el.mandatoryAspects;
        }
      });
      if (mandatoryAspects) {
        $.each(mandatoryAspects, function (index, el) {
          aspectQuery = el.substring(2);
          type += ' join ' + aspectQuery + ' AS ' + aspectQuery + ' on ' +
            aspectQuery + '.cmis:objectId = cmis:objectId';
        });
      }
      xhr.success(function (data) {
        $.each(data.aspect, function (index, el) {
          aspectQuery = el.substring(2);
          type += ' join ' + aspectQuery + ' AS ' + aspectQuery + ' on ' +
            aspectQuery + '.cmis:objectId = cmis:objectId';
        });
        $.map(data[data.columnSets[0]], function (el) {
          if (el.inSelect !== false) {
            columns.push(el.property);
          }
        });
        $.each(data[data.columnSets[0]], function (index, el) {
          if (el['class'] && el['class'].split(' ').indexOf('sort') >= 0) {
            sortFields[i18n.prop(el.label, el.label)] = el.property;
          }
        });
        activeCalls = new Search({
          elements: {
            table: displayTable,
            pagination: pagination,
            label: emptyResultset,
            orderBy: orderBy
          },
          orderBy: {
            field: 'jconon_call:codice',
            asc: true
          },
          type: type,
          columns: columns,
          fields: sortFields,
          mapping: function (mapping, doc) {
            $.each(data[data.columnSets[0]], function (index, el) {
              var pointIndex = el.property.indexOf('.'),
                property = pointIndex !== -1 ? el.property.substring(pointIndex + 1) : el.property;
              mapping[el.name] = doc[property] !== undefined ? doc[property] : null;
            });
            mapping.aspect = doc.aspect !== undefined ? doc.aspect : null;
            mapping.applicationId = applicationId;
            return mapping;
          },
          fetchCmisObject: false,
          maxItems: 10,
          display : {
            resultSet: function (resultSet, target) {
              query.val('')
                .attr("disabled", true)
                .tooltip({
                  html: true,
                  title: 'Effettua la ricerca su <u>tutti</u> i campi.'
                });
              nresults.text('');
              var parentType = activeCalls.changeType(),
                criteriaMaxItems = new Criteria(),
                searchjs = new Search({
                  type: activeCalls.changeType(),
                  disableRequestReplay: 'sub_' + activeCalls.changeType() + '_',
                  maxItems: 1000,
                  fetchCmisObject: false,
                  columns: columns,
                  mapping: function (mapping, doc) {
                    $.each(data[data.columnSets[0]], function (index, el) {
                      var pointIndex = el.property.indexOf('.'),
                        property = pointIndex !== -1 ? el.property.substring(pointIndex + 1) : el.property;
                      mapping[el.name] = doc[property] !== undefined ? doc[property] : null;
                    });
                    mapping.aspect = doc.aspect !== undefined ? doc.aspect : null;
                    mapping.applicationId = applicationId;
                    return mapping;
                  },
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
                          var items = [];
                          $.each(resultSet, function (index, el) {
                            items.push(resultSetx[el]);
                          });
                          displayRow(xhr, activeCalls, callTypeId, undefined, items, target, true);
                          pagination.hide();
                          if (query.val().trim().length === 0) {
                            callActiveCriteria(callTypeId, callId, cmisParentId, filterAllCall.data('value')).list(activeCalls);
                          } else {
                            nresults.text(' ' + resultSet.length + ' ' + (resultSet.length === 1 ? 'bando trovato' : 'bandi trovati'));
                          }
                        }
                      });
                    }
                  }
                });
              callActiveCriteria(callTypeId, callId, cmisParentId, filterAllCall.data('value')).list(searchjs);
              displayRow(xhr, activeCalls, callTypeId, undefined, resultSet, target, true);
            }
          }
        });
        searchPanel
          .append(orderBy);
        content
          .append(searchPanel)
          .append(filterAllCall)
          .append(emptyResultset)
          .append(displayTable)
          .append(pagination);
        if (hasMacroCall) {
          URL.Data.search.query({
            queue: true,
            data: {
              q: "select cmis:parentId from jconon_call:folder where cmis:objectId ='" + callId + "'"
            }
          }).done(function (rs) {
            if (rs.totalNumItems === 1) {
              cmisParentId = rs.items[0]['cmis:parentId'];
            }
            callActiveCriteria(callTypeId, callId, cmisParentId, filterAllCall.data('value')).list(activeCalls);
          });
        } else {
          callActiveCriteria(callTypeId, callId, cmisParentId, filterAllCall.data('value')).list(activeCalls);
        }
        modal = UI.bigmodal(i18n['title.call.active'], content);
      });
    }
  };
});
