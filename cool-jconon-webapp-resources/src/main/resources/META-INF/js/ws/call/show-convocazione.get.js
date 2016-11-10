define(['jquery', 'header', 'json!common', 'json!cache', 'cnr/cnr.bulkinfo', 'cnr/cnr.search', 'cnr/cnr.url', 'i18n', 'cnr/cnr.ui', 'cnr/cnr.actionbutton', 'cnr/cnr.jconon', 'handlebars', 'cnr/cnr', 'moment', 'cnr/cnr.application', 'cnr/cnr.criteria', 'cnr/cnr.ace', 'cnr/cnr.call', 'cnr/cnr.node'], function ($, header, common, cache, BulkInfo, Search, URL, i18n, UI, ActionButton, jconon, Handlebars, CNR, moment, Application, Criteria, Ace, Call, Node) {
  "use strict";
  var orderLabel = {
      'Stato' : 'jconon_convocazione:stato'
    },
    folderChange,
    bulkInfo,
    criteriaFilters = $('#criteria'),
    rootFolderId,
    search;  
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
                q : 'SELECT cmis:objectId FROM jconon_convocazione:attachment WHERE cmis:objectId = \''+ el.id + '\'',
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
      stato = el['jconon_convocazione:stato'],
      statoMap = {
        'GENERATO': 'label-warning',
        'FIRMATO': 'label-info',
        'SPEDITO': 'label-important',
        'RICEVUTO': 'label-success'
      },
      annotationData = $('<span class="muted annotation">Convocazione per il ' + CNR.Date.format(el['jconon_convocazione:data'], null, 'DD/MM/YYYY H:mm') + '</span>'),
      annotationLuogo = $('<span class="muted annotation">' + el['jconon_convocazione:luogo'] + '</span>'),
      annotationEmail = $('<span class="muted annotation">' + (el['jconon_convocazione:email_pec']||el['jconon_convocazione:email']) + '</span>'),
      annotationStato = $('<span class="label animated flash"></span>').addClass(statoMap[stato]).append(stato),
      annotation = $('<span class="muted annotation">ultima modifica: ' + CNR.Date.format(el.lastModificationDate, null, 'DD/MM/YYYY H:mm') + '</span>');
    if (permission !== undefined) {
      customButtons.permissions = permission;
    }
    item.attr('href', URL.urls.search.content + '?nodeRef=' + el.id + '&guest=true');
    item.after(annotationData);
    item.after(annotationEmail.append(', stato ').append(annotationStato));
    item.after(annotationLuogo);
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
        type: "jconon_convocazione:attachment doc",
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
            $('#total').text(data.totalNumItems + ' convocazioni trovate in totale');
          });
          $('#export-xls').off('click').on('click', function () {
            var close = UI.progress();
            jconon.Data.call.applications_convocazioni({
              type: 'GET',
              data:  getUrlParams(page),
              success: function (data) {
                var url = URL.template(jconon.URL.call.downloadXLS, {
                  objectId: data.objectId,
                  fileName: data.fileName,
                  exportData: true,
                  mimeType: 'application/vnd.ms-excel;charset=UTF-8'
                });     
                window.location = url;
              },
              complete: close,
              error: URL.errorFn
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
                path: "D:jconon_convocazione:attachment"
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
                  jconon.Data.call.convocazione.firma({
                    type: 'POST',
                    data:  d,
                    success: function (data) {
                      UI.info("Sono state firmate " + data.numConvocazioni + " convocazioni.", function () {
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
            myModal = UI.modal('Firma convocazioni', content, callback);
          });
          $('#invia').off('click').on('click', function () {
              var content = $("<div>").addClass('modal-inner-fix'),
                bulkinfo,
                myModal,
                settings = {
                  target: content,
                  formclass: 'form-horizontal jconon',
                  name: 'invia',
                  path: "D:jconon_convocazione:attachment"
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
                      }
                    ); 
                    jconon.Data.call.convocazione.invia({
                      type: 'POST',
                      data:  d,
                      success: function (data) {
                        UI.info("Sono state inviate " + data.numConvocazioni + " convocazioni.", function () {
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
              myModal = UI.modal('Invia convocazioni tramite PEC Aruba', content, callback);
            });
          return deferred;
        }
      });
      rootFolderId = data['cmis:objectId'];
      bulkInfo =  new BulkInfo({
        target: criteriaFilters,
        formclass: 'form-horizontal jconon',
        path: 'D:jconon_convocazione:attachment',
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