define(['jquery', 'header', 'json!common', 'json!cache', 'cnr/cnr.bulkinfo', 'cnr/cnr.search', 'cnr/cnr.url', 'i18n', 'cnr/cnr.ui', 'cnr/cnr.actionbutton', 'cnr/cnr.jconon', 'handlebars', 'cnr/cnr', 'moment', 'cnr/cnr.application', 'cnr/cnr.criteria', 'cnr/cnr.ace', 'cnr/cnr.call', 'cnr/cnr.node'], function ($, header, common, cache, BulkInfo, Search, URL, i18n, UI, ActionButton, jconon, Handlebars, CNR, moment, Application, Criteria, Ace, Call, Node) {
  "use strict";
  var orderLabel = {
      'Stato' : 'jconon_comunicazione:stato'
    },
    folderChange,
    bulkInfo,
    criteriaFilters = $('#criteria'),
    rootFolderId,
    search;
  if (common.User.admin || Call.isConcorsi()) {
    $('#inviaEmail').show();
  }
  function displayDocument(el, refreshFn, permission) {
    var tdText,
      tdButton,
      item = $('<a href="#">' + el.name + '</a>'),
      customButtons = {
        history : false,
        copy: false,
        cut: false,
        select : function () {
          var deferred;             
          deferred = URL.Data.search.query({
              queue: true,
              data: {
                q : 'SELECT cmis:objectId FROM jconon_comunicazione:attachment WHERE cmis:objectId = \''+ el.id + '\'',
                relationship: 'parent'
              }
          });
          deferred.done(function (data) {
            URL.Data.proxy.people({
              type: 'GET',
              contentType: 'application/json',
              placeholder: {
                user_id: el['jconon_attachment:user']
              },
              success: function (dataUser) {
                var application = data.items[0].relationships.parent[0],
                  email = dataUser.email === 'nomail' ? dataUser.emailesterno || dataUser.emailcertificatoperpuk : dataUser.email,
                  cap_comunicazioni = application['jconon_application:cap_comunicazioni'],
                  provincia_comunicazioni = application['jconon_application:provincia_comunicazioni'],
                  title = '<h2 class="text-info"><i class="icon-info-sign text-info"/> ' + application['jconon_application:cognome'].toUpperCase() + ' ' + application['jconon_application:nome'].toUpperCase() + '</h2>',
                  annotationUser = $('<h5>' + 
                    application['jconon_application:indirizzo_comunicazioni'] + ' Num. ' + application['jconon_application:num_civico_comunicazioni'] + '<br>' +
                    (cap_comunicazioni ? ' CAP ' + cap_comunicazioni : '') +  ' ' + application['jconon_application:comune_comunicazioni'] +
                    (provincia_comunicazioni ? ' (' + provincia_comunicazioni  + ')' : '') + ' ' + application['jconon_application:nazione_comunicazioni'] + '<br>' +
                    'Tel: ' + application['jconon_application:telefono_comunicazioni'] + '<br>' +
                    'EMail: <a href="mailto:' + email + '">' + email + '</a>' +
                    '</h5>');
                UI.modal(title, annotationUser);
              },
              error: function () {
                UI.error(i18n['message.user.not.found']);
              }
            });            
          });          
        }
      },
      stato = el['jconon_comunicazione:stato'],
      statoMap = {
        'GENERATO': 'label-warning',
        'FIRMATO': 'label-info',
        'SPEDITO': 'label-important',
        'CONSEGNATO': 'label-success',
        'NON_CONSEGNATO': 'label-inverse',
        'RICEVUTO': 'label-success'
      },
      annotationEmail = $('<span class="muted annotation">' + (el['jconon_comunicazione:email_pec']||el['jconon_comunicazione:email']) + '</span>'),
      annotationStato = $('<span class="label animated flash"></span>').addClass(statoMap[stato]).append(stato),
      annotation = $('<span class="muted annotation">ultima modifica: ' + CNR.Date.format(el.lastModificationDate, null, 'DD/MM/YYYY H:mm') + '</span>');
    if (permission !== undefined) {
      customButtons.permissions = permission;
    }
    item.attr('href', URL.urls.search.content + '?nodeRef=' + el.id + '&guest=true');
    item.after(annotationEmail.append(', stato ').append(annotationStato));
    item.after(annotation.prepend(', ').prepend(CNR.fileSize(el.contentStreamLength)));

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
    }, null, customButtons, null, refreshFn));
    return $('<tr></tr>')
      .append(tdText)
      .append(tdButton);
  }

  URL.Data.node.node({
    data: {
      excludePath : true,
      nodeRef : params.callId
    },
    success: function (data) {
      search = new Search({
        elements: {
          table: $("#items"),
          pagination: $("#itemsPagination"),
          orderBy: $("#orderBy"),
          label: $("#emptyResultset"),
          total: $('#total')
        },
        type: "jconon_comunicazione:attachment doc",
        fields: orderLabel,
        calculateTotalNumItems: true,
        maxItems: 10,
        display : {
          row : function (el, refreshFn, permission) {
            return displayDocument(el, refreshFn, permission);
          }
        },
        dataSource: function (page, setting, getUrlParams) { 
          var deferred;             
          deferred = URL.Data.search.query({
              queue: setting.disableRequestReplay,
              data: getUrlParams(page)
          });
          deferred.done(function (data) {
            $('#total').text(data.totalNumItems + ' comunicazioni trovate in totale');
              $('#elimina').off('click').on('click', function () {
                UI.confirm('Sei sicuro di voler eliminare ' + data.totalNumItems + ' comunicazioni?', function() {
                    var close = UI.progress();
                    jconon.Data.call.eliminaallegati({
                      type: 'POST',
                      data: {
                        q: getUrlParams(page).q
                      },
                      success: function (data) {
                        UI.info("Sono state eliminate " + data.numAllegati + " comunicazioni, quelle in stato diverso da GENERATO o FIRMATO non sono state eliminate.", function () {
                          $('#applyFilter').click();
                        });
                      },
                      complete: close,
                      error: URL.errorFn
                    });
                });
              });
          });
          $('#firma').off('click').on('click', function () {
            var content = $("<div>").addClass('modal-inner-fix'),
              bulkinfo,
              myModal,
              settings = {
                target: content,
                formclass: 'form-horizontal jconon',
                name: 'firma',
                metadata : {
                  'firma' : 'Firmato da ' + common.User.firstName + ' ' + common.User.lastName
                },
                path: "D:jconon_comunicazione:attachment"
              };
            bulkinfo = new BulkInfo(settings);
            bulkinfo.render();
           
            function callback() {
              if (bulkinfo.validate()) {
                  var close = UI.progress(), d = bulkinfo.getData();
                  d.push({
                      id: 'query',
                      name: 'query',
                      value: getUrlParams(page).q
                  });        
                  jconon.Data.call.comunicazione.firma({
                    type: 'POST',
                    data:  d,
                    success: function (data) {
                      UI.info("Sono state firmate " + data.numComunicazioni + " comunicazioni.", function () {
                        myModal.modal('hide');
                        $('#stato').find("[data-value='FIRMATO']").click();
                      });
                    },
                    complete: close,
                    error: URL.errorFn
                  });
              }
              return false;
            }
            myModal = UI.modal('Firma comunicazioni', content, callback);
          });
          $('#invia').off('click').on('click', function () {
              var content = $("<div>").addClass('modal-inner-fix'),
                bulkinfo,
                myModal,
                settings = {
                  target: content,
                  formclass: 'form-horizontal jconon',
                  name: 'invia',
                  path: "D:jconon_comunicazione:attachment",
                  callback : {
                      afterCreateForm: function (form) {
                          form.prepend($('<h4 class="alert">').append(i18n['label.pec.email.hint']));
                      }
                  }
                };
              bulkinfo = new BulkInfo(settings);
              bulkinfo.render();
             
              function callback() {
                if (bulkinfo.validate()) {
                    var close = UI.progress(), d = bulkinfo.getData();
                    d.push(
                      {
                        id: 'query',
                        name: 'query',
                        value: getUrlParams(page).q
                      },
                      {
                        id: 'callId',
                        name: 'callId',
                        value: params.callId
                      },
                      {
                        id: 'PEC',
                        name: 'PEC',
                        value: true
                      }
                    ); 
                    jconon.Data.call.comunicazione.invia({
                      type: 'POST',
                      data:  d,
                      success: function (data) {
                        UI.info("Sono state inviate " + data.numComunicazioni + " comunicazioni.", function () {
                          myModal.modal('hide');
                          $('#stato').find("[data-value='SPEDITO']").click();
                        });
                      },
                      complete: close,
                      error: URL.errorFn
                    });
                }
                return false;
              }
              myModal = UI.modal('Invia comunicazioni tramite PEC', content, callback);
            });
            $('#inviaEmail').off('click').on('click', function () {
                UI.confirm(i18n.prop('message.confirm.send.email', i18n.prop('actions.comunicazioni')), function () {
                    var close = UI.progress(), d = [];
                    d.push(
                      {
                        id: 'query',
                        name: 'query',
                        value: getUrlParams(page).q
                      },
                      {
                        id: 'callId',
                        name: 'callId',
                        value: params.callId
                      },
                      {
                        id: 'PEC',
                        name: 'PEC',
                        value: false
                      }
                    );
                    jconon.Data.call.comunicazione.invia({
                      type: 'POST',
                      data:  d,
                      success: function (data) {
                        UI.info("Sono state inviate " + data.numComunicazioni + " comunicazioni.", function () {
                          $('#stato').find("[data-value='SPEDITO']").click();
                        });
                      },
                      complete: close,
                      error: URL.errorFn
                    });
                });
            });
          return deferred;
        }
      });
      rootFolderId = data['cmis:objectId'];
      bulkInfo =  new BulkInfo({
        target: criteriaFilters,
        formclass: 'form-horizontal jconon',
        path: 'D:jconon_comunicazione:attachment',
        name: 'search',
        callback : {
          afterCreateForm: function (form) {
            form.keypress(function (e) {
              if (e.which == 13) {
                filter();  
                return false;    //<---- Add this line
              }
            });
            $('#stato').on('click', filter);
            $('#user').on('change', filter);            
            $('#resetFilter').on('click', function () {
              criteriaFilters.find('input').val('');
              criteriaFilters.find('textarea').val('');
              criteriaFilters.find('.widget').data('value', '');

              var btns = criteriaFilters.find('.btn-group-vertical .btn');

              btns
                .removeClass('active');

              criteriaFilters
                .find('.btn-group-vertical')
                .find('.default')
                .addClass('active');
              filter();  
            });
            $('#applyFilter').on('click', filter);
            filter();
          }
        }
      });
      bulkInfo.render();
    }    
  });

  function filter() {
    var criteria = jconon.getCriteria(bulkInfo),
      propValue = bulkInfo.getDataValueById('contenuto');
    if (propValue) {
      criteria.contains(propValue, 'doc');
    }  
    criteria.inTree(rootFolderId, 'doc').list(search);
  };
});