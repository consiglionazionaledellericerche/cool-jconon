define(['jquery', 'header', 'i18n', 'cnr/cnr.bulkinfo', 'cnr/cnr', 'cnr/cnr.ui.authority', 'cnr/cnr.ui', 'cnr/cnr.url', 'exceptionParser', 'list', 'cnr/cnr.ui.tree'], function ($, header, i18n, BulkInfo, CNR, Authority, UI, URL, expParser, List, Tree) {
  "use strict";
  var target = $('#models'),//div dove vengono caricati i "documenti" recuperati
    spinner = $('<br><i class="icon-spinner icon-spin icon-2x" id="spinner-' + new Date().getTime() + '"></i>'),
    fadeTime = 100,
    models = [],
    close = null,
    errorMsg,
    errorList;


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
        aspectsName = model.aspects ? model.aspects.map(function (aspect) {return aspect.name.replace(':', '-'); }).toString() : null,
        btnDelete = $('<button class="delete btn btn-mini btn-danger"><i class="icon-trash icon-white"></i> Cancella</button>').data('nodeRef', model.nodeRef).data('activationState', model.active).data('aspectsName', aspectsName),
        btnActivate = $('<button class="activateModel btn btn-mini"><i class="icon-upload"></i> Disattiva Modello</a>').data('nodeRef', model.nodeRef).data('activationState', model.active).data('aspectsName', aspectsName),
        btnEdit = $('<a href="' + URL.urls.root + 'updateModel?nodeRef=' + model.nodeRef + '" class="edit btn btn-mini"><i class="icon-edit icon-white"></i> Edit</a>'),
        btnGenerateTemplate = $('<button class="generateTemplate btn btn-mini btn-primary"><i class="icon-edit icon-white"></i> Genera Template</a>').data('aspectsName', model.aspects),
        typesItem,
        aspectsItem,
        jsonTypes,
        jsonAspects,
        line = $('<hr color="red" size="4" >');//linea di separazione tra i documenti recuperati

      item.append('<h5>' + model.nameFile + '</h5>');
      if (model.active === true) {
        item.append('<strong>Stato: </strong>').append(getBadge('Attivo')).append('<br/>');
        if (model.aspects) {
          btnGroup.append(btnGenerateTemplate).append(' ');
        }
      } else if (model.active === false) {
        item.append('<strong>Stato: </strong>').append(getBadge('NonAttivo')).append('<br/>');
        btnActivate.html(' Attiva Modello').data('activationState', false);
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
      btnGroup.prepend(btnDelete).append(' ');
      btnGroup.prepend(btnEdit).append(' ');
      btnGroup.prepend(btnActivate).append(' ');
      item.append(btnGroup);
      item.prepend(line);
      target.append(item);
    });
  }


  function activateModel(nodeRef, activate) {
    URL.Data.model.activate({
      processData: false,
      type: "POST",
      placeholder: {
        'id' : nodeRef.split(';')[0],
        'version' : nodeRef.split(';')[1],
        'activate' : activate
      },
      success: function (data) {
        //visualizzazione dell'eccezione in caso di fallimento dell'attivazione/disattivazione del model
        if (data.status === 'ko') {
          errorMsg = $("<div> Errore " + (activate ? "nell\'attivazione" : "nella disattivazione") + " del modello. Il server riporta:<div>");
          errorList = $("<div class='modalBoxMessage mdMonospace' ></div>").append(expParser.parseModelDesignerError(data));
          errorMsg.append(errorList);
          UI.error(errorMsg, null, true, true);
        } else {
          //query d'aggiornamento dello stato
          UI.success('Modello ' + (data.statusModel === 'activate' ? 'ATTIVATO' : 'DISATTIVATO') + ' correttamente', function () {
            retrieve(mostraDati);
          });
        }
      },
      complete: function () {
        close();
      }
    });
  }

  function deleteModel(nodeRef) {
    URL.Data.model.modelNodeRef({
      processData: false,
      type: "DELETE",
      placeholder: {
        'id' : nodeRef.split(';')[0],
        'version' : nodeRef.split(';')[1]
      },
      success: function (data) {
        if (data.status === "ko") {
          errorMsg = $("<div>Errore nella cancellazione del modello. Il server riporta:<div>");
          errorList = $("<div class='modalBoxMessage mdMonospace' ></div>").append(expParser.parseModelDesignerError(data));
          errorMsg.append(errorList);
          UI.error(errorMsg, null, true, true);
        } else {
          UI.success('Modello cancellato correttamente', function () {
            retrieve(mostraDati);
          });
        }
      },
      error: function () {
        UI.error('Errore nella rimozione del Modello');
      },
      complete: function () {
        close();
      }
    });
  }

  function comune(event, action) {
    var nodeRef = $(event.target).data('nodeRef'),
      activationState = $(event.target).data('activationState'),
      actionName = 'La disattivazione',
      customFunction = function () { return activateModel(nodeRef, !activationState); };
    if (action === 'delete') {
      actionName = 'L\'eliminazione';
      customFunction = function () { return deleteModel(nodeRef); };
    }
    close = UI.progress();
    if (activationState) {
      URL.Data.model.docsByPath({
        processData: false,
        placeholder: {
          'id' : nodeRef.split(';')[0],
          'version' : nodeRef.split(';')[1],
          'aspectsName': $(event.target).data('aspectsName')
        },
        success: function (data) {
          if (data.docs.length > 0 || data.templates.length > 0) {
            close();
            UI.confirm(actionName + ' del modello comporta l\'eliminazione di ' + data.docs.length + ' document' + getSuffisso(data.docs.length) + ' e di ' + data.templates.length + ' templates: procedere comunque?', function () {
              //cancellazione/disattivazione effettiva del modello
              close = UI.progress();
              customFunction();
            });
          } else {
            customFunction();
          }
        },
        error: function () {
          close();
          UI.error('Errore nella rimozione dei Documenti');
        }
      });
    } else {
      customFunction();
    }
  }


//delete singolo Model (utilizzando il noderef)
  target.on('click', '.delete', function (event) {
    comune(event, 'delete');
    return false;
  });

//Attivazione / disattivazione dei modelli
  target.on('click', '.activateModel', function (event) {
    comune(event, 'activate');
    return false;
  });


  //Generazione dei template
  target.on('click', '.generateTemplate', function (event) {
    var aspectsTree = $('<div id="aspectsTree"></div>'), selectedAspects = [],
      aspects = $(event.target).data('aspectsName'),
      bulkinfoTemlate = new BulkInfo({
        target: aspectsTree,
        path: 'modelDesignerBulkinfo',
        name: 'createTemplate'
      }), element = $('<div></div>').attr('id', 'aspectsToSend'),
      jsonAspects = [
        {
          "data": "Aspects: ",
          "children": JSON.parse(JSON.stringify($.map(aspects, function (val, i) {
            return val.name;
          })))
        }
      ];

    element.jstree({
      "themes" : {
        "theme" : "apple",
        "url": URL.urls.root + "res/css/jstree/" + "apple" + '/' + 'style.css',
        "dots" : false,
        "icons" : false
      },
      "plugins" : ["themes", "json_data", "ui", "checkbox"],
      "json_data" : {
        data: jsonAspects
      }
    });
    bulkinfoTemlate.render();


    function callbackTemplateClose() {
      if (bulkinfoTemlate.validate()) {
        aspectsTree.remove();
      }
    }
    function callbackTemplate() {
      var close = UI.progress(), message, errorList;
      $.each(element.jstree("get_checked", null, true).text().trim().split("   "), function (index, aspect) {
        if (aspect !== "Aspects: ") {
          selectedAspects.push(aspect);
        }
      });
      if (bulkinfoTemlate.validate()) {
        URL.Data.model.generateTemplate({
          type: 'POST',
          placeholder: {
            'nameTemplate': bulkinfoTemlate.getDataValueById('nameTemplate'),
            'selectedAspects': selectedAspects.filter(function (item, pos) { return selectedAspects.indexOf(item) === pos; })
          },
          success: function (data) {
            if (data.status === 'ok') {
              UI.success("Template creato correttamente");
            } else {
              close();
              message = $("<div> Errore nella creazione del Template. Il server riporta:<div>");
              errorList = $("<div class='modalBoxMessage mdMonospace' ></div>").append(expParser.parseModelDesignerError(data));
              message.append(errorList);
              UI.error(message, null, true, true);
            }
          },
          complete: close
        });
      } else {
        close();
        //riproposizione della modale nel caso in cui il bulkinfo non supera la validazione 
        UI.modal("Creazione nuovo Template", aspectsTree, callbackTemplate, callbackTemplateClose);
      }
    }
    UI.modal("Creazione nuovo template", aspectsTree, callbackTemplate, callbackTemplateClose);
    aspectsTree.append(element);
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
        var close = UI.progress(), message, errorList;
        URL.Data.model.models({
          type: 'POST',
          data: bulkinfo.getData(),
          contentType: 'application/json',
          success: function (data) {
            if (data.status === 'ok') {
              UI.success("Modello creato correttamente: <a href='" + URL.urls.root + 'updateModel?nodeRef=' + data.nodeRefModel + "'> Modifica </a>");
            } else {
              message = $("<div> Errore nella creazione del modello. Il server riporta:<div>");
              errorList = $("<div class='modalBoxMessage mdMonospace' ></div>").append(expParser.parseModelDesignerError(data));
              message.append(errorList);
              UI.error(message, null, true, true);
            }
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