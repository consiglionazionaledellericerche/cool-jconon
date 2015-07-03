define(['jquery', 'header', 'cnr/cnr.bulkinfo', 'cnr/cnr', 'cnr/cnr.url', 'cnr/cnr.jconon', 'json!common', 'cnr/cnr.ui', 'i18n', 'cnr/cnr.ui.tree'], function ($, header, BulkInfo, CNR, URL, jconon, common, UI, i18n, Tree) {
  "use strict";

  var idCategory, bulkinfoTop, bulkinfoDown, bulkinfoReopen, nameCategory,
    nameForm = 'helpDesk',
    helpDesk = $('#helpdesk2'),
    helpDeskTop = $('<div id="helpdeskTop"></div>'),
    helpDeskDown = $('<div id="helpdeskDown"></div>'),
    inputFile = $('<div class="control-group form-horizontal"><label for="message" class="control-label">' + i18n['label.allega'] + '</label><div class="controls"> <input type="file" title="Search file to attach" name="allegato" /> </div> </div>'),
    btnSend = $('<div class="text-center"> <button id="send" name="send" class="btn btn-primary">' + i18n['button.send'] + '<i class="ui-button-icon-secondary ui-icon ui-icon-mail-open" ></i></button> </div>'),
    btnReopen = $('<div class="text-center"> <button id="sendReopen" class="btn btn-primary">' + i18n['button.send'] + '<i class="ui-button-icon-secondary ui-icon ui-icon-mail-open" ></i></button> </div>');


  function bulkinfoDownFunction(data) {
    var index, myData = $.map(data.items, function (el) {
      return {
        key: el['cmis:objectId'],
        value: el['cmis:objectId'],
        label: el['jconon_call:codice'] + ' | ' + el['jconon_call:descrizione'].replace(/<.*?>/gi, ' ').replace(/ +/g, ' ') + ' &nbsp',
        defaultLabel: el['jconon_call:codice'] + ' | ' + el['jconon_call:descrizione'].replace(/<.*?>/gi, ' ').replace(/ +/g, ' ') + ' &nbsp',
        property : "cmisCallId"
      };
    });

    bulkinfoDown = new BulkInfo({
      target: helpDeskDown,
      path: 'helpdeskBulkInfo',
      name: nameForm + "Down",
      callback: {
        beforeCreateElement: function (item) {
          //carico nel json del bulkinfo i risultati della query mappati precedentemente e ripuliti
          if (item.name === 'cmisCallId') {
            for (index = 0; index < myData.length; index++) {
              delete myData[index].allowableActions;
            }
            item.jsonlist = myData;
          }
        },
        afterCreateForm: function () {
          //inserisco il bottone di invio della segnalazione ed il widget che allega i file
          helpDeskDown.append(inputFile);
          helpDeskDown.append(btnSend);

          $('#send').click(function () {
            var formData = new CNR.FormData();
            //leggo i dati di entrambi i bulkinfo della pagina
            $.each(bulkinfoTop.getData(), function (index, item) {
              formData.data.append(item.name, item.value);
            });
            $.each(bulkinfoDown.getData(), function (index, item) {
              formData.data.append(item.name, item.value);
            });
            formData.data.append('allegato', $('input[type=file]')[0].files[0]);
            formData.data.append('category', idCategory);
            formData.data.append('descrizione', nameCategory);
            if (bulkinfoTop.validate() && bulkinfoDown.validate() && idCategory) {
              jconon.Data.helpdesk.send({
                type: 'POST',
                data: formData.getData(),
                contentType: formData.contentType,
                processData: false,
                success: function (data) {
                  //Scrivo il messaggio di successo in grassetto e raddoppio i </br>
                  helpDesk.remove();
                  $('#intestazione').html(i18n['message.helpdesk.send.success'].replace(/<\/br>/g, "</br></br>")).addClass('alert alert-success').css("font-weight", "Bold");
                },
                error: function (data) {
                  UI.error(i18n['message.helpdesk.send.failed']);
                }
              });
            } else {
              if (!idCategory) {
                UI.info('Selezionare almeno una categoria');
              }
            }
            return false;
          });
        }
      }
    });
  }

/*funzione che gestisce l'albero delle categorie dinamiche nella modale per la selezione delle stesse*/
  function modalFunction(event, node, category, tree) {
    var modalTree = $('<div></div>').attr('id', 'category'),
      modalControls = $('<div class="controls"></div>').append(modalTree).append(' '),
      modalLabel = $('<label class="control-label"></label>').attr('for', 'category'),//.text("Categoria: "),
      modalItem = $('<div class="control-group widget"></div>'),
      modalContent = $("<div></div>").attr('id', 'treePage').addClass('modal-inner-fix');

    modalItem.append(modalLabel).append(modalControls);
    modalTree.jstree({
      "themes" : {
        "theme" : "apple",
        "url": URL.urls.root + "res/css/jstree/" + "apple" + '/' + 'style.css',
        "dots" : false,
        "icons" : false
      },
      "plugins" : ["themes", "json_data", "ui"],
      "json_data" : {
        data: category
      }
    }).bind("select_node.jstree", function (event, node) {
      var selectedNode = node.rslt.obj;
      if (selectedNode.hasClass("jstree-leaf")) {
        nameCategory = selectedNode.text().trim();
        idCategory = selectedNode.attr("idCategory");
      } else {
        nameCategory = null;
        idCategory = null;
        //rimuovo la class di selezione dal nodo selezionato se non è una foglia
        selectedNode.children()[1].removeAttribute('class');
      }
    }).bind('loaded.jstree', function (e, data) {
      //nel caso di riproposizione della modale riapro e
      // seleziono la categoria scelta precedentemente
      data.inst.get_container().find('li').each(function (i) {
        if (data.inst._get_node($(this)).attr("idCategory") === idCategory) {
          data.inst.select_node($(this));
        }
      });
    });
    modalContent.append(modalItem);

    UI.modal('Categorie', modalContent, function () {
      //modifico l'albero della pagina principale con la label selezionata nella modale
      tree.jstree({
        "themes" : {
          "theme" : "apple",
          "url": URL.urls.root + "res/css/jstree/" + "apple" + '/' + 'style.css',
          "dots" : false,
          "icons" : false
        },
        "plugins" : ["themes", "json_data", "ui"],
        "json_data" : {
          "data": nameCategory || category[0].data,
          "attr": {
            "idCategory": idCategory || category[0].attr.idCategory
          }
        }
      }).bind("select_node.jstree", function (event, node) {
        //modifica della categoria (dalla pagina principale richiama la modale)
        modalFunction(event, node, category, tree);
      });
      if (!(nameCategory && idCategory)) {
        UI.error("Selezionare almeno una categoria senza sottocategorie!", modalFunction(event, node, category, tree));
      }
    });
  }


  function bulkinfoTopFunction(category) {
    bulkinfoTop = new BulkInfo({
      target: helpDeskTop,
      path: 'helpdeskBulkInfo',
      name: nameForm + "Top",
      callback: {
        afterCreateForm: function () {
          var treeDiv = $('<div class="control-group form-horizontal"></div>'),
            tree = $('<div></div>').attr('id', 'category'),
            controls = $('<div class="controls"></div>').append(tree).append(' '),
            label = $('<label class="control-label"></label>').attr('for', 'category').text("Categoria: "),
            item = $('<div class="control-group widget"></div>'),
            categoryParent = $.extend(true, {}, category)[0];
          delete categoryParent.children;
          item.append(label).append(controls);
          //genero l'albero delle categorie dinamiche
          tree.jstree({
            "themes" : {
              "theme" : "apple",
              "url": URL.urls.root + "res/css/jstree/" + "apple" + '/' + 'style.css',
              "dots" : false,
              "icons" : false
            },
            "plugins" : ["themes", "json_data", "ui"],
            "json_data" : {
              data: categoryParent
            }
          }).bind("select_node.jstree", function (event, node) {
            modalFunction(event, node, category, tree);
          });

          // riempio alcuni campi in casi di utente loggato
          if (!common.User.isGuest) {
            $('#firstName').val(common.User.firstName);
            $('#firstName').attr("readonly", "true");
            $('#lastName').val(common.User.lastName);
            $('#lastName').attr("readonly", "true");
            $('#email').val(common.User.email);
            $('#confirmEmail').val(common.User.email);
            $('#email').attr("readonly", "true");
          }
          //inserisco l'albero delle categorie dinamiche
          treeDiv.append(item);
          helpDeskTop.append(treeDiv);
        }
      }
    });
  }


  function loadBandi(problemiHelpdesk) {
    //carico dinamicamente i bandi attivi
    URL.Data.search.query({
      data: {
        q: 'select this.jconon_call:codice, this.cmis:objectId, this.jconon_call:descrizione' +
           ' from jconon_call:folder AS this ' +
           ' where this.jconon_call:data_fine_invio_domande >=  TIMESTAMP \'' + common.now + '\'' +
           ' and this.jconon_call:data_inizio_invio_domande <=  TIMESTAMP \'' + common.now + '\'' +
           ' order by this.jconon_call:codice ',
        maxItems : 1000
      },
      success: function (bandi) {
        //la pagina è divisa in 3 div (helpdeskTop, tree con le categorie dinamiche ed helpdeskDown)
        bulkinfoTopFunction(problemiHelpdesk);
        bulkinfoDownFunction(bandi);
        bulkinfoDown.render();
        bulkinfoTop.render();
        helpDesk.append(helpDeskTop);
        helpDesk.append(helpDeskDown);
      }
    });
  }


  //trasforma il json ad un solo livello in un json con i discendenti
  function giveDepth(linearJson) {
    return linearJson.map(function (o) {
      return o.reduce(function (depthJson, b) {
        var lastChild;
        depthJson.children = depthJson.children || [];
        if (depthJson.livello + 1 === b.livello && depthJson.attr.idCategory === b.idPadre) {
          depthJson.children.push(b);
        } else {
          lastChild = depthJson.children[depthJson.children.length - 1];
          lastChild.children = lastChild.children || [];
          lastChild.children.push(b);
        }
        return depthJson;
      });
    });
  }


  //pulisco il json dai campi non necessari e rimappo gli altri
  function mappingAndClean(jsonOriginal) {
    var json = [], accum, segment;
    jsonOriginal.forEach(function (el) {
      if (el.enabled === "y") {
        if (el.hasOwnProperty("nome")) {
          el.data = el.nome;
          delete el.nome;
        }
        if (el.hasOwnProperty("id")) {
          el.attr = {};
          el.attr.idCategory = el.id;
          delete el.id;
        }

        if (el.hasOwnProperty("enabled")) { delete el.enabled; }
        if (el.hasOwnProperty("descrizione")) { delete el.descrizione; }

        if (el.livello === 1) {
          accum = true;
          if (segment && segment.length) {
            json.push(segment);
          }
          segment = [el];
        } else if (accum) {
          segment.push(el);
        }
      }
    });
    if (segment && segment.length) {
      json.push(segment);
    }
    return giveDepth(json);
  }


  // helpdesk in caso di "reopen"
  if (URL.querystring.from.id && URL.querystring.from.azione) {
    bulkinfoReopen = new BulkInfo({
      target: helpDesk,
      path: 'helpdeskBulkInfo',
      name: 'reopen_HelpDesk',
      callback: {
        afterCreateForm: function () {
          $('#helpdeskBulkInfo').append(btnReopen);
          $('#sendReopen').click(function () {
            var formData = new CNR.FormData(),
              fd;
            $.each(bulkinfoReopen.getData(), function (index, el) {
              formData.data.append(el.name, el.value);
            });
            fd = formData.getData();
            fd.append('id', URL.querystring.from.id);
            fd.append('azione', URL.querystring.from.azione);
            if (bulkinfoReopen.validate()) {
              jconon.Data.helpdesk({
                type: 'POST',
                data: fd,
                contentType: formData.contentType,
                processData: false,
                success: function (data) {
                  UI.info(i18n['message.reopen.helpdesk.send.success'], function () {
                    window.location = URL.urls.root;
                  });
                },
                error: function () {
                  UI.error(i18n['message.reopen.helpdesk.send.failed'], function () {
                    window.location = URL.urls.root;
                  });
                }
              });
            }
            return false;
          });
        }
      }
    });
    bulkinfoReopen.render();
  } else {
    if (!common.User.isGuest) {
      // se l'utente è loggato carico meno campi e alcuni campi vengono valorizzati
      nameForm = 'user_HelpDesk';
    }

    jconon.Data.helpdesk.categorie({
      success: function (newDynamicCategory) {
        loadBandi(mappingAndClean(newDynamicCategory));
      }
    });
  }
});