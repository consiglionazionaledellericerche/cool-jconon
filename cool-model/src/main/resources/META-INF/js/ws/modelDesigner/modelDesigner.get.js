define(['jquery', 'header', 'i18n', 'cnr/cnr.bulkinfo', 'cnr/cnr', 'cnr/cnr.ui.authority', 'cnr/cnr.ui', 'cnr/cnr.url', 'exceptionParser', 'list', 'cnr/cnr.ui.tree'], function ($, header, i18n, BulkInfo, CNR, Authority, UI, URL, expParser, List, Tree) {
  "use strict";
  var target = $('#models'),//div dove vengono caricati i "documenti" recuperati
    spinner = $('<br><i class="icon-spinner icon-spin icon-2x" id="spinner-' + new Date().getTime() + '"></i>'),
    fadeTime = 100,
    models = [],
    close = null;


  function retrieve(callBack) {
    target.fadeOut(fadeTime, function () {
      spinner.insertBefore(target);
      URL.Data.model.models({
        cache: false, // prevents default caching
        queue: true,
        success: function (data) {
          models = data.models;
          callBack(models);
          target.fadeIn(400);
        },
        complete: function () {
          spinner.remove();
        },
        fail: function () {
          UI.error('Errore nella ricerca dei Modelli');
        }
      });
    });
  }

//css specifici per alcuni campi dei documenti visualizzati
  function getBadge(type) {
    var el, t = {
      Attivo: {
        label: "Attivo",
        css: 'badge-inverse animated flash'
      },
      NonAttivo: {
        label: "Non Attivo",
        css: 'animated flash'
      }
    };
    el = $('<span class="badge">' + (t[type] ? t[type].label : ' '  + type) + '</span>');
    if (t[type] && t[type].css) {
      el.addClass(t[type].css);
    }
    return el;
  }

  function getSuffisso(size) {
    var suffisso;
    if (size === 1) {
      suffisso = 'o';
    } else {
      suffisso = 'i';
    }
    return suffisso;
  }


  function mostraDati(models) {
    target.html('')
      .append('<br>').append('<span class="label"> Trovat' + getSuffisso(models.length) + ' ' + models.length + ' Modell' + getSuffisso(models.length) + ' </span>')
      .append('<br/>');

    $.each(models, function (index, model) {
      var item = $('<div style="white-space:normal" align="justify" class= "list"></div>'),
        btnGroup = $('<div class="btn-group"></div>'),
        btnDelete = $('<button class="delete btn btn-mini btn-danger"><i class="icon-trash icon-white"></i> Cancella</button>').data('nodeRef', model.nodeRef).data('activate', model.active),
        btnActivate = $('<button class="activateModel btn btn-mini"><i class="icon-upload"></i> Disattiva Modello</a>').data('nodeRef', model.nodeRef).data('activate', false),
        btnEdit = $('<a href="' + URL.urls.root + 'page/updateModel?nodeRef=' + model.nodeRef + '" class="edit btn btn-mini"><i class="icon-edit icon-white"></i> Edit</a>'),
        typesItem,
        aspectsItem,
        jsonTypes,
        jsonAspects,
        line = $('<hr color="red" size="4" >');//linea di separazione tra i documenti recuperati

      item.append('<h5>' + model.nameFile + '</h5>');
      if (model.active === true) {
        item.append('<strong>Stato: </strong>').append(getBadge('Attivo')).append('<br/>');
      } else if (model.active === false) {
        item.append('<strong>Stato: </strong>').append(getBadge('NonAttivo')).append('<br/>');
        btnActivate.html(' Attiva Modello').data('activate', true);
      }
      item.append('<strong>Creato dall\'utente </strong>' + model.author).append('<br/>')
        .append('<strong>Descrizione: </strong>' + model.description).append('<br/>');
      if (model.types) {
        //json da passare al widget tree per visualizzare i types
        jsonTypes = [
          {
            "data" : "Types:",
            "children" : JSON.parse(JSON.stringify($.map(model.types, function (val, i) {
              return val.name;
            })))
          }
        ];
        typesItem = Tree.Widget("types", "", {
          settings: {
            dataSource: jsonTypes
          }
        });
        item.append(typesItem).append('<br/>');
      }
      if (model.aspects) {
        //json da passare al widget tree per visualizzare gli aspects
        jsonAspects = [
          {
            "data" : "Aspects:",
            "children" : JSON.parse(JSON.stringify($.map(model.aspects, function (val, i) {
              return val.name;
            })))
          }
        ];
        aspectsItem = Tree.Widget("aspects", "", {
          settings: {
            dataSource: jsonAspects
          }
        });
        item.append(aspectsItem).append('<br/>');
      }
      btnGroup.append(btnDelete).append(' ');
      btnGroup.append(btnEdit).append(' ');
      btnGroup.append(btnActivate).append(' ');
      item.append(btnGroup);
      item.prepend(line);
      target.append(item);
    });
  }

  function deleteModel(nodeRef, reNodeRef) {
    close = UI.progress();
    URL.Data.model.modelNodeRef({
      processData: false,
      type: "DELETE",
      placeholder: {
        'store_type' : nodeRef.replace(reNodeRef, '$1'),
        'store_id' : nodeRef.replace(reNodeRef, '$2'),
        'id' : nodeRef.replace(reNodeRef, '$3')
      },
      success: function (data) {
        UI.success('Modello cancellato correttamente');
        close();
        retrieve(mostraDati);
      },
      error: function () {
        close();
        UI.error('Errore nella rimozione dei Documenti');
      }
    });
  }

//delete singolo Model (utilizzando il noderef)
  target.on('click', '.delete', function (event) {
    var nodeRef = $(event.target).data('nodeRef'),
      reNodeRef = new RegExp("([a-z]+)\\:\/\/([a-z]+)\/(.*)", 'gi');
    //se il modello è attivo visualizza i documenti istanza dei type in esso definiti
    if ($(event.target).data('activate')) {
      close = UI.progress();
      URL.Data.model.docsByPath({
        processData: false,
        placeholder: {
          'store_type' : nodeRef.replace(reNodeRef, '$1'),
          'store_id' : nodeRef.replace(reNodeRef, '$2'),
          'id' : nodeRef.replace(reNodeRef, '$3')
        },
        success: function (data) {
          close();
          UI.confirm('L\'eliminazione del modello comporta l\'eliminazione di ' + data.docs.length + ' document' + getSuffisso(data.docs.length) + ': procedere comunque?', function () {
            //cancellazione effettiva del modello
            deleteModel(nodeRef, reNodeRef);
          });
        },
        error: function () {
          UI.error('Errore nella rimozione dei Documenti');
        }
      });
    } else {
      deleteModel(nodeRef, reNodeRef);
    }
    return false;
  });

  target.on('click', '.activateModel', function (event) {
    var nodeRef = $(event.target).data('nodeRef'),
      close = UI.progress(),
      reNodeRef = new RegExp("([a-z]+)\\:\/\/([a-z]+)\/([a-z0-9-]+)\\;(.*)", 'gi');
    URL.Data.model.activate({
      processData: false,
      type: "POST",
      placeholder: {
        'store_type' : nodeRef.replace(reNodeRef, '$1'),
        'store_id' : nodeRef.replace(reNodeRef, '$2'),
        'id' : nodeRef.replace(reNodeRef, '$3'),
        'version' : nodeRef.replace(reNodeRef, '$4'),
        'activate' : $(event.target).data('activate')
      },
      success: function (data) {
        //visualizzazione dell'eccezione in caso di fallimento dell'attivazione/disattivazione del model
        if (data.status === 'ko') {
          var message = $("<div>Errore nell\'attivazione / disattivazione del modello. Il server riporta:<div>"),
            errorList = $("<div class='modalBoxMessage mdMonospace' ></div>").append(expParser.parseModelDesignerError(data));
          message.append(errorList);
          UI.error(message, null, true, true);
        } else if (data.statusModel === 'activate') {
          UI.success('Modello ATTIVATO correttamente');
        } else if (data.statusModel === 'disactivate') {
          UI.success('Modello DISATTIVATO correttamente');
        }
        close();
        //query d'aggiornamento dello stato
        retrieve(mostraDati);
      }
    });
    return false;
  });

//filtro sull'author e sui types lato js
  $('#authorFilter').bind('input propertychange', function () {
    var filtredModels = $.grep(models, function (model) {
      var types = $.map(model.types || [], function (el) {
          return el.name.toLowerCase();
        });
      return types.concat(model.author.toLowerCase()).join(' ').indexOf($('#authorFilter').val().toLowerCase()) >= 0;
    });
    mostraDati(filtredModels);
    return false;
  });


  $('#createModel').click(function () {
    var target = $('<div></div>'),
      bulkinfo = new BulkInfo({
        target: target,
        path: 'modelDesignerBulkinfo',
        name: 'createModel'
      });

    bulkinfo.render();
    function callbackClose() {
      if (bulkinfo.validate()) {
        target.remove();
      }
    }
    function callback() {
      if (bulkinfo.validate()) {
        var close = UI.progress();
        URL.Data.model.models({
          type: 'POST',
          data: bulkinfo.getData(),
          success: function (data) {
            UI.success("Modello creato correttamente: <a href='" + URL.urls.root + 'page/updateModel?nodeRef=' + data.nodeRefModel + "'> Modifica </a>");
            //query d'aggiornamento
            retrieve(mostraDati);
          },
          complete: close
        });
      } else {
        //riproposizione della modale nel caso in cui il bulkinfo non supera la validazione 
        UI.modal("Creazione nuovo Modello", target, callback, callbackClose);
      }
    }
    UI.modal("Creazione nuovo Modello", target, callback, callbackClose);
    return false;
  });

  //query all'avvio
  retrieve(mostraDati);
});