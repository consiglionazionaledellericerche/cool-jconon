
/* javascript closure providing all the search functionalities */
define(['jquery', 'cnr/cnr', 'i18n', 'cnr/cnr.actionbutton', 'json!common', 'handlebars',
  'cnr/cnr.validator', 'cnr/cnr.url', 'cnr/cnr.ui', 'cnr/cnr.jconon', 'cnr/cnr.url',
  'cnr/cnr.ace', 'cnr/cnr.ui.authority', 'cnr/cnr.search', 'cnr/cnr.criteria', 'cnr/cnr.node',
  'cnr/cnr.bulkinfo', 'cnr/cnr.ui.checkbox', 'json!cache', 'cnr/cnr.attachments',
  'cnr/cnr.ui.select', 'cnr/cnr.application', 'cnr/cnr.ui.widgets', 'cnr/cnr.ui.user-titles', 'cnr/cnr.ui.user-grades', 'searchjs'
  ], function ($, CNR, i18n, ActionButton, common, Handlebars,
  validator, cnrurl, UI, jconon, URL,
  Ace, Authority, Search, Criteria, Node,
  BulkInfo, Checkbox, cache, Attachments,
  select, Application, Widgets, UserTitles, UserGrades) {
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
    return common.User.groupsArray && (
        common.User.groupsArray.indexOf("GROUP_" + jconon_call_commissione) !== -1 ||
        common.User.groupsArray.indexOf("GROUP_CONCORSI_COMMISSIONE") !== -1
    );
  }

  function isRdP(jconon_call_rdp) {
    return common.User.groupsArray && (
        common.User.groupsArray.indexOf("GROUP_" + jconon_call_rdp) !== -1 ||
        common.User.groupsArray.indexOf("GROUP_CONCORSI_RDP") !== -1 ||
        common.User.groupsArray.indexOf("GROUP_GESTORI_TDET_PNRR") !== -1
    );
  }

  function isConcorsi() {
    return common.User.groupsArray && common.User.groupsArray.indexOf("GROUP_CONCORSI") !== -1;
  }

  function isGestoreBandi() {
    return common.User.groupsArray && common.User.groupsArray.indexOf("GROUP_GESTORI_BANDI") !== -1;
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
    if (cache['query.index.enable']) {
        criteria.inTree(cache.competition.id, 'root');
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
    criteria.lte('jconon_call:data_inizio_invio_domande_index', common.now, 'date');
    criteria.gte('jconon_call:data_fine_invio_domande_index', common.now, 'date');
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
    }, true);
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

  function estraiDomande(id, all, active, types, applications) {
    var close = UI.progress();
    jconon.Data.application.exportApplications({
      type: "POST",
      placeholder: {
        "store_type" : 'workspace',
        "store_id" : 'SpacesStore',
        "id" : id
      },
      data : {
        'all' : all,
        'active' : active,
        'types' : JSON.stringify(types),
        'applications': JSON.stringify(applications)
      },
      success: function (data) {
        var downlod = $("<a data-dismiss='modal' aria-hidden='true' href='#'> Download </a>").click(function () {
          window.location = cache.baseUrl + data.url;
        });
        UI.success($("<div>File creato correttamente: </div>").append(downlod));
      },
      complete: close
    });
  }

  function results(query, skipCount, closeFn, applicationElement) {
    URL.Data.search.query({
      queue: true,
      data: {
        maxItems:1000,
        skipCount: skipCount,
        includeAllowableActions: false,
        q: query
      }
    }).success(function(data) {
      $.each(data.items, function(index, el) {
        applicationElement.append(new Option(el['cmis:name'], el['cmis:objectId'], false, false)).trigger('change');
      });
      skipCount = skipCount + 1000;
      if (skipCount < data.totalNumItems) {
        jconon.progressBar(Math.trunc(skipCount * 100 / data.totalNumItems) + '%');
        results(query, skipCount, closeFn, applicationElement)
      } else {
        closeFn();
      }
    });
  }

  function modalEstraiDomande(el) {
    var fieldSelect,
        applicationSelect,
        itemField,
        onlyPrint = $('<button class="btn btn-primary" data-dismiss="modal" title="Scarica un file zip con solo le domande senza allegati"><i class="icon-print"></i> Domande</button>').
          off('click').on('click', function () {
            estraiDomande(el.id, false, false, undefined, applicationSelect.data('value'));
        }),
        allApplication = $('<button class="btn btn-success" data-dismiss="modal" title="Scarica un file zip delle domande confermate comprese di allegati"><i class="icon-download-alt"></i> Confermate con allegati</button>').
          off('click').on('click', function () {
            estraiDomande(el.id, true, false, fieldSelect.data('value'), applicationSelect.data('value'));
        }),
        activeApplication = $('<button class="btn btn-info" data-dismiss="modal" title="Scarica un file zip delle domande attive comprese di allegati"><i class="icon-download-alt"></i> Attive con allegati</button>').
          off('click').on('click', function () {
            estraiDomande(el.id, true, true, fieldSelect.data('value'), applicationSelect.data('value'));
        }),
      btnClose,
      modalField = $('<div class="control-group">'),
      m,
      itemField = {
        property : 'select2FieldType',
        multiple : true,
        class : 'input-xxlarge',
        ghostName : 'typeFieldTitle',
        jsonlist : [
            {key : 'D:jconon_attachment:application',label : 'Domanda'},
            {key : 'D:jconon_attachment:integration',label : 'Integrazioni alla Domanda'}
          ].concat(
          Application.completeList(el['jconon_call:elenco_association'],cache.jsonlistApplicationAttachments),
          Application.completeList(el['jconon_call:elenco_sezioni_curriculum'],cache.jsonlistApplicationCurriculums),
          Application.completeList(el['jconon_call:elenco_sezioni_curriculum_ulteriore'],cache.jsonlistApplicationCurriculums),
          Application.completeList(el['jconon_call:elenco_prodotti'], cache.jsonlistApplicationProdotti.concat(cache.jsonlistApplicationAttachments))
        )
      },
      applicationField = {
        property : 'applicationFieldType',
        multiple : true,
        class : 'input-xxlarge',
        ghostName : 'applicationFieldTitle'
      },
      close = UI.progress(),
      query = "SELECT cmis:objectId, cmis:name from jconon_application:folder " +
           "where IN_TREE('" + el.id + "') and jconon_application:stato_domanda = 'C' and jconon_application:esclusione_rinuncia is null " +
           "order by jconon_application:cognome, jconon_application:nome";
    fieldSelect = select.Widget('select2FieldType', 'Estrai solo file con tipologia: [lasciare vuoto per tutte le tipologie]', itemField);
    modalField.append('<input type="hidden" id="typeFieldTitle">');
    fieldSelect.find('.controls').parent().attr('style','min-width:100%');
    modalField.append(fieldSelect);

    applicationSelect = select.Widget('applicationFieldType', 'Estrai solo le seguenti domande: [lasciare vuoto per tutte le domande]', applicationField);
    modalField.append('<input type="hidden" id="applicationFieldTitle">');
    applicationSelect.find('.controls').parent().attr('style','min-width:100%');
    modalField.append(applicationSelect);
    results(query, 0, close, applicationSelect.find('select'));

    m = UI.modal('<i class="icon-print"></i> Estrazione domande relative al bando ' +el['jconon_call:codice'], modalField);
    btnClose = m.find(".modal-footer").find(".btn");
    btnClose.before(onlyPrint).before(allApplication).before(activeApplication);
    $('button', m.find(".modal-footer")).tooltip({
      placement: 'top',
      container: m.find(".modal-footer")
    });
  }

  function callbackModalCommission(modal, content) {
    var username = content.find('#username'),
        controls = username.parents('.control-group'),
        cognome = content.find('#cognome'),
        nome = content.find('#nome'),
        email = content.find('#email'),
        sesso = content.find('#sesso');
    if (controls.data('value') !== null) {
        cognome.attr('disabled', 'true');
        nome.attr('disabled', 'true');
        email.attr('disabled', 'true');
        sesso.find('button').attr('disabled', 'true');
    }
    username.on("focusout", function () {
        if (controls.data('value') !== null) {
            URL.Data.proxy.people({
              type: 'GET',
              contentType: 'application/json',
              placeholder: {
                user_id: controls.data('value')
              },
              success: function (dataUser) {
                cognome.val(dataUser.lastName);
                cognome.attr('disabled', 'true');
                nome.val(dataUser.firstName);
                nome.attr('disabled', 'true');
                email.val(dataUser.email === 'nomail' ? dataUser.emailesterno || dataUser.emailcertificatoperpuk : dataUser.email);
                email.attr('disabled', 'true');
                if (dataUser.codicefiscale) {
                    var maleFemale = dataUser.codicefiscale.substring(9,11) > 40 ? "F" : "M";
                    sesso.find('button').removeClass('active');
                    sesso.find('button[data-value=' + maleFemale + ']').addClass('active');
                    sesso.parents('.control-group').data('value', maleFemale);
                    sesso.find('button').attr('disabled', 'true');
                }
                console.log(dataUser);
              },
              error: function () {
                UI.error(i18n['message.user.not.found']);
              }
            });
        } else {
            cognome.attr('disabled', null).removeClass('disabled');
            nome.attr('disabled', null).removeClass('disabled');
            email.attr('disabled', null).removeClass('disabled');
            sesso.find('button').attr('disabled', null).removeClass('disabled');
        }
    });
  }

  function displayCommission(el, refreshFn, permission, extendButton, members, groupName) {
    var tdText,
      tdButton,
      nominativo = el['jconon_commissione:cognome'] + ' ' + el['jconon_commissione:nome'],
      item = $('<a>' + (el['jconon_commissione:appellativo'] || '') + ' ' + nominativo + '</a>'),
      abilitato = members.indexOf(el['jconon_commissione:username']) !== -1,
      elegibile = ['A_PRE', 'B_COM', 'C_SEG'].indexOf(el['jconon_commissione:ruolo']) !== -1 &&
            el['jconon_commissione:username'] !== null,
      customButtons = $.extend({}, {
        abilita_commissario : abilitato || !elegibile ? false : function() {
          if (cache.commissionVideoGender) {
              URL.Data.proxy.people({
                type: 'GET',
                contentType: 'application/json',
                data: {
                  groups: false
                },
                placeholder: {
                  user_id: el['jconon_commissione:username']
                },
                success: function (data) {
                    if (!data.whatch_video_gender) {
                        UI.confirm(i18n.prop('message.video.gender.warning'), function () {
                          jconon.addUserToGroup(groupName, el['jconon_commissione:username'], function() {
                            members.push(el['jconon_commissione:username']);
                            refreshFn();
                          });
                        });
                    } else {
                      jconon.addUserToGroup(groupName, el['jconon_commissione:username'], function() {
                        members.push(el['jconon_commissione:username']);
                        refreshFn();
                      });
                    }
                    URL.Data.common({
                      type: "DELETE",
                      placeholder: {
                        authortiyName: el['jconon_commissione:username']
                      }
                    });
                }
              });
          } else {
              jconon.addUserToGroup(groupName, el['jconon_commissione:username'], function() {
                members.push(el['jconon_commissione:username']);
                refreshFn();
              });
          }
        },
        disabilita_commissario : !abilitato || !elegibile ? false : function() {
          jconon.removeUserFromGroup(groupName, el['jconon_commissione:username'], function() {
            members.splice( $.inArray(el['jconon_commissione:username'],members) ,1 );
            URL.Data.common({
              type: "DELETE",
              placeholder: {
                authortiyName: el['jconon_commissione:username']
              }
            });
            refreshFn();
          });
        },
        permissions: false,
        history : false,
        copy: false,
        cut: false,
        update: false,
        remove: abilitato ? false : function () {
            UI.confirm('Sei sicuro di voler eliminare il ' + i18n['label.jconon_commissione:ruolo' + el['jconon_commissione:ruolo']] +
                ' ' + nominativo  + '?', function () {
                Node.remove(el['alfcmis:nodeRef'], refreshFn);
            });
        },
        edit: abilitato && el['jconon_commissione:ruolo'] !== null ? false : function () {
            var content = $("<div></div>").addClass('modal-inner-fix'), bulkinfo,
              afterRender = function () {
                var modal = UI.bigmodal("Modifica Commissario", content, function () {
                  if (!bulkinfo.validate()) {
                    UI.alert("alcuni campi non sono corretti");
                    return false;
                  }
                  var d = bulkinfo.getData();
                  d.push({
                    id: 'cmis:objectId',
                    name: 'cmis:objectId',
                    value: el['alfcmis:nodeRef']
                  });
                  Node.updateMetadata(d, refreshFn);
                });
                callbackModalCommission(modal, content);
              };
            bulkinfo = new BulkInfo({
              target: content,
              path: 'D:jconon_commissione:metadata',
              objectId: el['alfcmis:nodeRef'],
              callback: {
                afterCreateForm: afterRender
              }
            });
            bulkinfo.render();
        }
      }, extendButton),
      annotationRuolo = $('<b class="d-block pl-1">' + i18n['label.jconon_commissione.ruolo_' + (el['jconon_commissione:ruolo'] || 'notfound')]  + '</b>');
      if (el['jconon_commissione:ruolo'] === 'A_PRE') {
        annotationRuolo.addClass('text-info');
      } else if (el['jconon_commissione:ruolo'] === 'B_COM') {
        annotationRuolo.addClass('text-success');
      } else if (el['jconon_commissione:ruolo'] === 'C_SEG') {
        annotationRuolo.addClass('text-warning');
      } else {
        annotationRuolo.addClass('text-error');
      }
    if (el['jconon_commissione:username']) {
        item
            .off('click')
            .on('click', function (event) {
              Ace.showMetadata(el['jconon_commissione:username'], common.User.admin || isConcorsi());
            });
        if (abilitato) {
            item.after($('<label class="label label-success animated flash pull-right">abilitato</label>'));
        } else {
            item.after($('<label class="label label-warning animated flash pull-right">non abilitato</label>'));
        }
    } else {
        item.addClass('text-error');
        item.after($('<label class="label label-important animated flash pull-right">valorizzare nome utente</label>'));
    }
    item.after(annotationRuolo);
    if (el['jconon_commissione:qualifica']) {
        item.after($('<span class="d-block pl-1">' + '<b>Qualifica:</b> ' + el['jconon_commissione:qualifica'] + '</span>'));
    }
    if (el['jconon_commissione:email']) {
        item.after($('<span class="d-block pl-1">' + '<b>Email:</b> ' + el['jconon_commissione:email'] + '</span>'));
    }

    tdText = $('<td></td>')
      .addClass('span10')
      .append($('<i class="icon-user text-info"></i>'))
      .append(' ')
      .append(item);
    tdButton = $('<td></td>').addClass('span2').append(ActionButton.actionButton({
      name: el.name,
      nodeRef: el['alfcmis:nodeRef'],
      baseTypeId: el.baseTypeId,
      objectTypeId: el.objectTypeId,
      mimeType: el.contentType,
      allowableActions: el.allowableActions
    }, null, customButtons, {abilita_commissario: 'icon-ok', disabilita_commissario: 'icon-remove'}, refreshFn, true));
    return $('<tr></tr>')
      .append(tdText)
      .append(tdButton);
  }

  function callDisplayAttachment(el, refreshFn, i18nLabelsObj, callMetadata) {
      return jconon.defaultDisplayDocument(el, refreshFn, undefined, true, false,
        {
          linkcallfile : (common.User.admin || isConcorsi() || isRdP(callMetadata['jconon_call:rdp'])) &&
                        callMetadata['cmis:secondaryObjectTypeIds'].indexOf('P:jconon_call:aspect_macro_call') != -1 ? function () {
            UI.confirm(i18n.prop('label.call.confirm.link.file', el.name, callMetadata['jconon_call:codice']), function () {
                var close = UI.progress();
                jconon.Data.call.linkcallfile({
                  type: 'POST',
                  data:  [{name: 'callId', value: callMetadata['cmis:objectId']},{name: 'id', value: el.id}],
                  success: function (data) {
                    UI.info(i18n.prop('label.call.confirmed.link.file',data.result));
                  },
                  complete: close,
                  error: URL.errorFn
                });
            });
          } : false,
          copycallfile : (common.User.admin || isConcorsi() || isRdP(callMetadata['jconon_call:rdp'])) &&
                        callMetadata['cmis:secondaryObjectTypeIds'].indexOf('P:jconon_call:aspect_macro_call') != -1 ? function () {
            UI.confirm(i18n.prop('label.call.confirm.copy.file', el.name, callMetadata['jconon_call:codice']), function () {
                var close = UI.progress();
                jconon.Data.call.copycallfile({
                  type: 'POST',
                  data:  [{name: 'callId', value: callMetadata['cmis:objectId']},{name: 'id', value: el.id}],
                  success: function (data) {
                    UI.info(i18n.prop('label.call.confirmed.copy.file',data.result));
                  },
                  complete: close,
                  error: URL.errorFn
                });
            });
          } : false,
          sendcallfile : function () {
            var objectId = el.id,
              objectTypeId = el.objectTypeId,
              content = $("<div>").addClass('modal-inner-fix'),
              bulkinfo,
              myModal,
              settings = {
                target: content,
                formclass: 'form-horizontal jconon',
                name: 'invia',
                path: "D:jconon_comunicazione:attachment"
              };
            bulkinfo = new BulkInfo(settings);
            bulkinfo.render();

            function callback() {
              if (bulkinfo.validate()) {
                  var close = UI.progress(), d = bulkinfo.getData();
                  d.push(
                    {
                      id: 'objectId',
                      name: 'objectId',
                      value: el.id
                    },
                    {
                      id: 'callId',
                      name: 'callId',
                      value: metadata['cmis:objectId']
                    }
                  );
                  jconon.Data.call.inviaallegato({
                    type: 'POST',
                    data:  d,
                    success: function (data) {
                      UI.info("Sono state inviate " + data.length + " comunicazioni.<br>" + (data.length !== 0 ? data.join(', ') : ''));
                    },
                    complete: close,
                    error: URL.errorFn
                  });
              }
              return false;
            }
            myModal = UI.modal('Invia comunicazione ['+ el.name + ']', content, callback);
          }
        },
        {
          sendcallfile : 'icon-envelope',
          linkcallfile : 'icon-share',
          copycallfile : 'icon-share-alt'
        },
        true
      );
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
        UI.bigmodal('<i class="icon-info-sign text-info animated flash"></i> ' + i18n['label.th.jconon_bando_elenco_titoli_studio'], data);
        return e.preventDefault();
      });

      var rows = target.find('tbody tr'),
        customButtons = {
          select: false
        },
        dropdownSchedaValutazione = {},
        dropdownSchedaAnonima = {},
        dropdownConvocazioni = {},
        dropdownEsclusioni = {},
        dropdownComunicazioni = {};
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
          //Cerco tutte le eventuali proroghe e aggiungo i dati
          URL.Data.search.query({
            queue: false,
            data: {
                maxItems:1000,
                fetchCmisObject: false,
                includeAllowableActions: false,
                q: "select * from jconon_attachment:prorogation where IN_FOLDER('" + el['cmis:objectId'] + "') order by jconon_attachment:data_fine asc"
            }
          }).done(function (rs) {
            if (rs.totalNumItems > 0) {
                var divProrogation;
                $.each(rs.items, function (indexChild, elChild) {
                    $('#prorogation-' + el['cmis:objectId']).append(
                        $('<br><span>' + (elChild['cmis:objectTypeId'] == 'D:jconon_attachment:call_re_judgment' ? i18n.prop('label.th.jconon_bando_proroga_riapertura_giudiziale'):
                            '<strong class="animated flash">' + i18n.prop('label.th.jconon_bando_proroga_riapertura') + '</strong>' ) + ': ' +
                            i18n.prop('label.th.jconon_bando_data_scadenza') + ': ' + CNR.Date.format(elChild['jconon_attachment:data_fine'], null, 'DD/MM/YYYY H:mm:ss') + '</span>'
                        )
                    );
                });
            }
          });
          if (common.User.admin || isConcorsi() || (isRdP(el['jconon_call:rdp']) && el.allowableActions.indexOf('CAN_CREATE_DOCUMENT') != -1 )|| isCommissario(el['jconon_call:commissione'])) {
              customButtons.attachments = function () {
                var bigModal,
                    content = $("<div></div>").addClass('modal-inner-fix'),
                    metadata = el,
                    attachment = new Attachments({
                      isSaved: true,
                      selectGroupClass: 'text-center d-block',
                      affix: content,
                      objectTypes: cache.jsonlistCallAttachments,
                      cmisObjectId: el.id,
                      search: {
                        type: 'jconon_attachment:document',
                        displayRow: function (el, refreshFn, i18nLabelsObj) {
                            return callDisplayAttachment(el, refreshFn, i18nLabelsObj, metadata);
                        },
                        displayAfter: function (documents, refreshFn, resultSet, isFilter) {
                          if (!isFilter) {
                            bigModal.find('#myModalLabel').html('<i class="icon-edit"></i> Allegati ' + i18n.prop('label.righe.visualizzate', documents.totalNumItems));
                          }
                        },
                        fetchCmisObject: true,
                        calculateTotalNumItems: true,
                        maxItems: 10,
                        filter: false
                      },
                      submission : {
                          callback : function (attachmentsData, data) {
                            if (data['cmis:objectTypeId'] === 'D:jconon_attachment:call_convocazioni_candidati' && (common.User.admin || isConcorsi() || isGestoreBandi())) {
                              var startDate = moment(common.now),
                                endDate = moment(data['jconon_attachment:data_scadenza_convocazione']),
                                defaultFormat = 'YYYY-MM-DDTHH:mm:ss.SSSZ';
                                URL.Data.frontOffice.doc({
                                  type: "POST",
                                  data: {
                                    stackTrace: JSON.stringify({
                                      "avvisi:number": Number(moment(common.now).format('YYYYMMDDHH')),
                                      "avvisi:style": "information",
                                      "avvisi:type":"Avviso Bando " + el['jconon_call:codice'],
                                      "avvisi:data": startDate.format(defaultFormat),
                                      "avvisi:dataScadenza": endDate.format(defaultFormat),
                                      "avvisi:title": data['cmis:name'],
                                      "avvisi:text":"<p>Per scaricare l'avviso cliccare <a href='rest/content?nodeRef=" + data['cmis:objectId'] + "'>qui</a></p>",
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
                attachment();
                bigModal = UI.bigmodal('<i class="icon-edit"></i> Allegati', content);
              };
          } else {
              customButtons.attachments = function () {
                displayAttachments(el.id);
              };
          }
          customButtons.edit = function () {
            window.location = jconon.URL.call.manage + '?call-type=' + el.objectTypeId + '&cmis:objectId=' + el.id;
          };
          customButtons.listApplication = (common.User.admin || isConcorsi() || isRdP(el['jconon_call:rdp']) || isCommissario(el['jconon_call:commissione'])) ? function () {
            window.location = jconon.URL.application.list + '?cmis:objectId=' + el.id;
          } : false;
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
          if (common.User.admin) {
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
          customButtons.commission = !isActive(el.data_inizio_invio_domande, el.data_fine_invio_domande) || (!(el['group_can_submit_application'] == null) && (common.User.admin || isConcorsi())) ? function () {
            Widgets['ui.user-titles'] = UserTitles;
            Widgets['ui.user-grades'] = UserGrades;
            var bigModal,
                content = $("<div></div>").addClass('modal-inner-fix'),
                members,
                groupCommissione = el['jconon_call:commissione'],
                attachment = new Attachments({
                  isSaved: true,
                  selectGroupClass: 'd-block',
                  buttonUploadLabel: 'Inserisci Commissario',
                  affix: content,
                  objectTypes: [{
                    'key' : 'D:jconon_commissione:metadata',
                  }],
                  submission: {
                    requiresFile: false,
                    showFile: false,
                    bigmodal: true,
                    callbackModal: function(modal, content) {
                      callbackModalCommission(modal, content);
                    }
                  },
                  cmisObjectId: el.id,
                  search: {
                    type: 'jconon_commissione:metadata',
                    label: 'label.count.no.commission',
                    displayRow: function (el, refreshFn, permission) {
                      return displayCommission(el, refreshFn, permission, undefined, members, groupCommissione);
                    },
                    orderBy: [{
                      field: "jconon_commissione:ruolo",
                      asc: true
                    }],
                    fetchCmisObject: false,
                    calculateTotalNumItems: true,
                    maxItems: 10,
                    filter: false
                  }
                });
            URL.Data.proxy.childrenGroup({
              data: {
                fullName: "GROUP_" + groupCommissione
              },
              success: function (data) {
                members = $.map(data, function (el) {
                    return el.attr.shortName;
                });
                attachment();
                bigModal = UI.modal('<i class="icon-edit"></i> Modifica Commissione', content);
              }
            });
          } : false;
          customButtons.groupRdP = function () {
            var content = $('<div></div>').addClass('modal-inner-fix');
            manageGroup(el['jconon_call:rdp'], content);
            UI.modal('Modifica RdP', content);
          };
          customButtons.exportApplications = (common.User.admin || isConcorsi() || isRdP(el['jconon_call:rdp']) || isCommissario(el['jconon_call:commissione'])) ? function () {
            modalEstraiDomande(el);
          } : false;
          if (el['jconon_call:scheda_valutazione'] === true && !isActive(el.data_inizio_invio_domande, el.data_fine_invio_domande) &&
              (common.User.admin || isCommissario(el['jconon_call:commissione']) || isRdP(el['jconon_call:rdp']) || isConcorsi())) {
            if (common.User.admin || isRdP(el['jconon_call:rdp']) || isConcorsi()) {
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
            if (common.User.admin || isCommissario(el['jconon_call:commissione'])|| isRdP(el['jconon_call:rdp']) || isConcorsi()) {
              dropdownSchedaValutazione['Scarica le schede come ZIP'] = function () {
                scaricaSchedeValutazione(el, 'message.jconon_application_zip_schede', 'zip');
              };
              dropdownSchedaValutazione['Scarica le schede come XLS'] = function () {
                scaricaSchedeValutazione(el, 'message.jconon_application_xls_schede', 'xls');
              };
            }
            customButtons.scheda_valutazione = dropdownSchedaValutazione;
          }
          if (el['jconon_call:scheda_anonima_sintetica'] === true
              && el['jconon_call:stato'] !== 'PROCESSO_SCHEDE_ANONIME_CONCLUSO'
              && el['jconon_call:stato'] !== 'PROCESSO_SCHEDE_ANONIME_CONCLUSO_COMMISSIONE_NON_ABILITATA'
              && el['jconon_call:stato'] !== 'PROCESSO_SCHEDE_ANONIME_ABILITATA_COMMISSIONE'
              && !isActive(el.data_inizio_invio_domande, el.data_fine_invio_domande) &&
              (common.User.admin || isCommissario(el['jconon_call:commissione']) || isRdP(el['jconon_call:rdp']))) {
            if (common.User.admin || isRdP(el['jconon_call:rdp'])) {
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
                      UI.success(data.message, function() {
                        filter(bulkInfo, search);
                      });
                    },
                    complete: close
                  });
                });
              };
              dropdownSchedaAnonima['Visualizza Schede'] = function () {
                window.location = jconon.URL.application.schede_anonime + '?cmis:objectId=' + el.id;
              };
              dropdownSchedaAnonima['Elabora Schede non anonime'] = function () {
                var close = UI.progress();
                jconon.Data.application.visualizzaSchedeNonAnonime({
                    placeholder: {
                      "id" : el.id
                    },
                    success: function (data) {
                        UI.info(i18n.prop('message.jconon_application_schede_nonanonime', common.User.email));
                    },
                    complete: close
                });
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
          if (el['jconon_call:scheda_anonima_sintetica'] === true
              && el['jconon_call:stato'] == 'PROCESSO_SCHEDE_ANONIME_CONCLUSO_COMMISSIONE_NON_ABILITATA'
              && !isActive(el.data_inizio_invio_domande, el.data_fine_invio_domande) &&
              (common.User.admin || isRdP(el['jconon_call:rdp']))) {
            customButtons.abilita_commissione = function () {
              UI.confirm(i18n.prop('message.jconon_application_abilita_processo_schede_anonime', el['jconon_call:codice']), function () {
                var close = UI.progress();
                jconon.Data.application.abilitaProcessoSchedeAnonime({
                  placeholder: {
                    "id" : el.id
                  },
                  success: function (data) {
                    UI.success(data.message, function() {
                      filter(bulkInfo, search);
                    });
                  },
                  complete: close
                });
              });
            };
          } else {
            customButtons.abilita_commissione = false;
          }

          if (!isActive(el.data_inizio_invio_domande, el.data_fine_invio_domande) &&
              (common.User.admin || isRdP(el['jconon_call:rdp']) || isConcorsi())) {
            dropdownConvocazioni['Genera'] = function () {
              window.location = jconon.URL.call.convocazione.genera + '?callId=' + el.id;
            };
            dropdownConvocazioni['Visualizza'] = function () {
              window.location = jconon.URL.call.convocazione.visualizza + '?callId=' + el.id;
            };
            dropdownEsclusioni['Genera'] = function () {
              window.location = jconon.URL.call.esclusione.genera + '?callId=' + el.id;
            };
            dropdownEsclusioni['Visualizza'] = function () {
              window.location = jconon.URL.call.esclusione.visualizza + '?callId=' + el.id;
            };
            dropdownComunicazioni['Genera'] = function () {
              window.location = jconon.URL.call.comunicazione.genera + '?callId=' + el.id;
            };
            dropdownComunicazioni['Visualizza'] = function () {
              window.location = jconon.URL.call.comunicazione.visualizza + '?callId=' + el.id;
            };
            customButtons.punteggi = function () {
              window.location = jconon.URL.call.punteggi.carica + '?callId=' + el.id;
            };
            customButtons.aggiungi_allegato = function () {
              window.location = jconon.URL.call.aggiungi_allegato + '?callId=' + el.id;
            };

            customButtons.convocazioni =  dropdownConvocazioni;
            customButtons.esclusioni =  dropdownEsclusioni;
            customButtons.comunicazioni =  dropdownComunicazioni;
          } else {
            customButtons.convocazioni = false;
            customButtons.esclusioni = false;
            customButtons.comunicazioni = false;
            customButtons.punteggi = false;
            customButtons.aggiungi_allegato = false;
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
        }, {
            publish: 'CAN_APPLY_ACL',
            commission: 'CAN_APPLY_ACL',
            groupRdP : 'CAN_APPLY_ACL',
            scheda_valutazione: 'CAN_CREATE_DOCUMENT',
            scheda_anonima: 'CAN_CREATE_DOCUMENT',
            listApplication: 'CAN_CREATE_DOCUMENT',
            exportApplications: 'CAN_CREATE_DOCUMENT',
            aggiungi_allegato: 'CAN_CREATE_DOCUMENT',
            convocazioni: 'CAN_CREATE_DOCUMENT',
            esclusioni: 'CAN_CREATE_DOCUMENT',
            comunicazioni: 'CAN_CREATE_DOCUMENT',
            punteggi: 'CAN_CREATE_DOCUMENT'
          },
          customButtons, {
            application: 'icon-edit',
            detail: 'icon-sitemap',
            attachments : 'icon-download-alt',
            publish: el['jconon_call:pubblicato'] ? 'icon-eye-close' : 'icon-eye-open',
            commission: 'icon-group',
            groupRdP: 'icon-user',
            listApplication: 'icon-folder-open-alt',
            exportApplications: 'icon-download',
            paste: 'icon-paste',
            scheda_valutazione: 'icon-table',
            scheda_anonima: 'icon-table',
            copia_bando: 'icon-copy',
            aggiungi_allegato: 'icon-upload',
            convocazioni: 'icon-inbox',
            esclusioni: 'icon-arrow-down',
            comunicazioni: 'icon-envelope',
            punteggi: 'icon-table',
            abilita_commissione: 'icon-time'
          }, undefined, undefined, undefined, 'pull-right');
        row = $(rows.get(index));
        if (!isMacroCall) {
          row
            .addClass('notMacroCall');
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
    isConcorsi : isConcorsi,
    modalEstraiDomande : modalEstraiDomande,
    callDisplayAttachment : callDisplayAttachment,
    filterApplicationByUsername : function(applicationElement, applicationSelectedEl, applicationTotalEl) {
        var btnFilter = $('<button class="btn" id="filterApplication" type="button" title="Filtra domande"><i class="icon-filter"></i></button>').click(function (eventObject) {
          var content = $('<div></div>').addClass('modal-inner-fix'),
            textarea = $('<textarea rows="10" class="input-xxlarge">').appendTo(content);
          UI.modal('Filtra domande tramite username separati da invio', content, function () {
            var users = content.find('textarea').val().split(/\r|\n/);
            $.each(users, function (index) {
                var option = applicationElement.find('option[data-title="'+users[index]+'"]');
                if (option.length > 0) {
                    option.prop('selected', true);
                }
            });
            applicationElement.trigger("change");
            applicationSelectedEl.text((applicationTotalEl ? applicationTotalEl.val() : '') + ' Domande selezionate ' + (applicationElement.val() ? applicationElement.val().length : 0));
          });
        });
        return btnFilter;
    },
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
    copyLabels : function (callFrom, callId) {
      return jconon.Data.call.copyLabels({
        data: {
          'callFrom' : callFrom,
          'callId' : callId,
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
        aspectQueryAdded = [],
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
          if (el !== 'P:sys:localized') {
            aspectQuery = el.substring(2);
            if (aspectQueryAdded.indexOf(aspectQuery) == -1) {
              type += ' join ' + aspectQuery + ' AS ' + aspectQuery + ' on ' +
                aspectQuery + '.cmis:objectId = cmis:objectId';
               aspectQueryAdded.push(aspectQuery);  
            }
          }          
        });
      }
      xhr.success(function (data) {
        $.each(data.aspect, function (index, el) {
          if (el !== 'P:sys:localized') {
            aspectQuery = el.substring(2);
            if (aspectQueryAdded.indexOf(aspectQuery) == -1) {
              type += ' join ' + aspectQuery + ' AS ' + aspectQuery + ' on ' +
                aspectQuery + '.cmis:objectId = cmis:objectId';
               aspectQueryAdded.push(aspectQuery);  
            }            
          }
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
          orderBy: [{
            field: 'jconon_call:codice',
            asc: true
          }],
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
