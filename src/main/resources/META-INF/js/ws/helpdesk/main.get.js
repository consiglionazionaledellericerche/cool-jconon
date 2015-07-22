define(['jquery', 'header', 'cnr/cnr.bulkinfo', 'cnr/cnr', 'cnr/cnr.url', 'cnr/cnr.jconon', 'json!common', 'cnr/cnr.ui', 'i18n', 'cnr/cnr.ui.tree'], function ($, header, BulkInfo, CNR, URL, jconon, common, UI, i18n, Tree) {
  "use strict";

  var idCategory, bulkinfoTop, bulkinfoDown, bulkinfoReopen, nameCategory, nomeBando,
    nameForm = 'helpDesk',
    helpDesk = $('#helpdesk2'),
    helpDeskTop = $('<div id="helpdeskTop"></div>'),
    helpDeskDown = $('<div id="helpdeskDown"></div>'),
    inputFile = $('<div class="control-group form-horizontal"><label for="message" class="control-label">' + i18n['label.allega'] + '</label><div class="controls"> <input type="file" title="Search file to attach" name="allegato" /> </div> </div>'),
    btnSend = $('<div class="text-center"> <button id="send" name="send" class="btn btn-primary">' + i18n['button.send'] + '<i class="ui-button-icon-secondary ui-icon ui-icon-mail-open" ></i></button> </div>'),
    btnReopen = $('<div class="text-center"> <button id="sendReopen" class="btn btn-primary">' + i18n['button.send'] + '<i class="ui-button-icon-secondary ui-icon ui-icon-mail-open" ></i></button> </div>');

  function bulkinfoDownFunction() {
    bulkinfoDown = new BulkInfo({
      target: helpDeskDown,
      path: 'helpdeskBulkInfo',
      name: nameForm + "Down",
      callback: {
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
              //appendo all'oggetto della mail il nome del bando (il padre della categoria scelta) 
              if (item.name === 'subject') {
                formData.data.append(item.name, nomeBando + " - " + item.value);
              } else {
                formData.data.append(item.name, item.value);
              }
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
  function modalFunction(event, node, categoryJson, tree) {
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
        data: categoryJson.children
      }
    }).bind("select_node.jstree", function (event, node) {
      var selectedNode = node.rslt.obj;
      if (selectedNode.hasClass("jstree-leaf")) {
        nameCategory = selectedNode.text().trim();
        nomeBando = nameCategory;
        idCategory = selectedNode.attr("idCategory");
        //legge la label del padre del nodo selezionato(verrà messo nell'oggetto della mail)
        if (node.inst._get_parent(selectedNode) !== -1) {
          nomeBando = node.inst._get_parent(selectedNode).find('a').first().text().trim();
          nameCategory = nomeBando + " - " + nameCategory;
        }
      } else {
        nameCategory = null;
        idCategory = null;
        nomeBando = null;
        //rimuovo la class di selezione dal nodo selezionato se non è una foglia
        selectedNode.children('a').removeClass('jstree-clicked');
      }
    }).bind('loaded.jstree', function (e, data) {
      //nel caso di riproposizione della modale riapro e
      // seleziono la categoria scelta precedentemente
      data.inst.get_container().find('li').each(function (i) {
        if (data.inst._get_node($(this)).attr("idCategory") === idCategory) {
          data.inst.select_node($(this));
        }
        if (!$(this).hasClass("jstree-leaf")) {
          $(this).children('a').addClass('cursor-not-allowed');
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
          "data": nameCategory,
          "attr": {
            "idCategory": idCategory
          }
        }
      }).bind("select_node.jstree", function (event, node) {
        //modifica della categoria (dalla pagina principale richiama la modale)
        modalFunction(event, node, categoryJson, tree);
      });
      if (!(nameCategory && idCategory)) {
        UI.error("Selezionare almeno una categoria senza sottocategorie!", modalFunction(event, node, categoryJson, tree));
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
            categoryParent;

          categoryParent = $.extend({}, category);
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

  function loadPage(problemiHelpdesk) {
    //carico l'intera pagina
    bulkinfoTopFunction(problemiHelpdesk);
    bulkinfoDownFunction();
    bulkinfoDown.render();
    bulkinfoTop.render();
    helpDesk.append(helpDeskTop);
    helpDesk.append(helpDeskDown);
  }


  function mappingAndClean(jsonOriginal) {
    var appo = $.extend(true, {}, jsonOriginal), childrens = [];

    if (appo.hasOwnProperty("nome")) {
      appo.data = appo.nome;
      delete appo.nome;
    }
    if (appo.hasOwnProperty("id")) {
      appo.attr = {};
      appo.attr.idCategory = jsonOriginal.id;
      delete appo.id;
    }

    if (appo.hasOwnProperty("enabled")) { delete appo.enabled; }
    if (appo.hasOwnProperty("descrizione")) { delete appo.descrizione; }

    if (appo.hasOwnProperty("idPadre")) { delete appo.idPadre; }
    if (appo.hasOwnProperty("livello")) { delete appo.livello; }
    if (appo.hasOwnProperty("assigned")) { delete appo.assigned; }

    if (appo.hasOwnProperty("sottocategorie")) {
      appo.sottocategorie.forEach(function(children) {
        childrens.push(mappingAndClean(children));
      });
      appo.children = childrens;
      delete appo.sottocategorie;
    }
    return appo;
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
              jconon.Data.helpdesk.send({
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
      data: {
        'enabled': 'y'
      },
      success: function (newDynamicCategory) {
        loadPage(mappingAndClean(newDynamicCategory));
      }
    });
  }
});