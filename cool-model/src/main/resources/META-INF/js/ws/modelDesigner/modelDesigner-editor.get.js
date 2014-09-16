require(['jquery', 'cnr/cnr.url', 'cnr/cnr.ui', 'cnr/cnr.ui.select', 'cnr/cnr', 'exceptionParser', 'header', 'xsd2json',
         'jquery.xmleditor', 'ace', 'jquery-ui', 'cycle', 'vkbeautify', "ace/range"], function ($, URL, UI, Select, CNR, expParser) {
  "use strict";
  var models = URL.Data.model.models({data: {active: true}}),
    extractor,
    typeName,
    propertyName,
    nodeId,
    element,
    nomeFile;

  function showError(response) {
    var message, errorList;

    message = $("<div>L'operazione non &egrave; andata a buon fine. Il server riporta:<div>");
    errorList = $("<div class='modalBoxMessage mdMonospace' ></div>").append(expParser.parseModelDesignerError(response));
    message.append(errorList);

    UI.error(message, null, true, true);
  }

  function deleteProperty() {
    var hideProgress = UI.progress();
    URL.Data.model.property({
      type: 'DELETE',
      placeholder: {
        store_type: 'workspace',
        store_id: 'SpacesStore',
        id: nodeId,
        typeName: typeName,
        property: propertyName
      },
      success: function (response) {
        hideProgress();
        if (response.status === 'ok') {
          UI.success("L'operazione &egrave; stata completata con successo.");
          element.removeExecute();
        } else {
          showError(response);
        }
        CNR.log(response);
      },
      errore: function (response) {
        hideProgress();
        showError(response);
        CNR.log(response);
      }
    });
  }


  function customUpdateFunction(xml) {
    var hideProgress = UI.progress();
    URL.Data.model.modelNodeRef({
      type: 'PUT',
      cache: false, // prevents default caching
      queue: true,
      data: {
        xml: xml,// la stringa dell'xml
        nameFile: nomeFile // il nome del file senza .xml
      },
      placeholder: {
        store_type: 'workspace',
        store_id: 'SpacesStore',
        id: nodeId
      },
      success: function (response) {
        hideProgress();
        CNR.log(response);
        if (response.status === 'ok') {
          UI.success("L'operazione &egrave; stata completata con successo.");
        } else {
          showError(response);
          //UI.bigError("L'operazione non &egrave; andata a buon fine. Il server riporta:<div class='modalBoxMessage'>" + expParser.parse(response) + "</div>");
          // response.message
          // response.type
          // response.stacktrace
        }
      },
      error: function (response) {
        hideProgress();
        CNR.log(response);
        showError(response);
      }
    });
  }

  function removeTestFunc(XMLElement) {
    var xmlElementName = XMLElement.objectType.name,
      arraydeglioggetti = XMLElement.editor.options.promptOnDelete,
      test = $.inArray(xmlElementName, arraydeglioggetti) >= 0,
      numDocs,
      confirmText,
      confirmDocList;
    element = XMLElement;

    if (test) {
      typeName = XMLElement.parentElement.parentElement.xmlNode[0].attributes.name.value;
      propertyName = XMLElement.xmlNode[0].attributes.name.value;
      if (typeName) {
        numDocs = URL.Data.model.docsByTypeName({data: {typeName: typeName}});
        confirmText = $("<div id='confirmText'><i class='icon-minus-sign text-error icon-4x'></i>A questo tipo sono associati i seguenti documenti.\nSe procedi eliminerai il campo da tutti questi documenti.<div>");
        confirmDocList = $("<div class='modalBoxMessage modelDesigner-loading'></div>");
        confirmText.append(confirmDocList);
        numDocs.done(function (risposta) {
          confirmDocList.removeClass('modelDesigner-loading');
          if (risposta.docs.length > 0) {
            $.each(risposta.docs, function (docIndex, doc) {
              confirmDocList.append(doc.name + "<br />");
            });
          } else {
            confirmDocList.append('Nessun documento trovato');
          }
        });
        UI.bigmodal(null, confirmText, deleteProperty);
        return false;
      } else {
        return true;
      }
    } else {
      return true;
    }
  }

  function loadXml(node, fileName) {
    var schema,
      nodeParts = node[0].split('/');
    nodeId = nodeParts[nodeParts.length - 1].split(';')[0];
    nomeFile = fileName.substr(0, fileName.lastIndexOf('.')); // strippo il nomde del file dall'estensione

    extractor = new Xsd2Json("/cool-jconon/res/model/modelSchema.xsd", {});
    schema = extractor.getSchema()();

    $("#xml_editor").xmlEditor({
      schema: schema,
      loadSchemaAsychronously: false,
      promptOnDelete: ['dd:property'],
      removeTestFunc: removeTestFunc,
      ajaxOptions: {
        xmlRetrievalPath: URL.urls.search.content + "?nodeRef=" + node,
        xmlUploadPath: '/cool-jconon/rest/models',
        xmlUploadFunction: customUpdateFunction
      }
    });

  }

  models.done(function (response) {

    var modelli = $.map(response.models, function (value) {
      return { key: value.nodeRef, label: value.name};
    }),
      select = Select.Widget(null, 'Modello da modificare', {
        jsonlist : modelli,
        placeholder : 'Selezionare modello',
        'class': 'input-xlarge',
        property: 'Nome'
      });

    select.appendTo('#model-selector');
    select.on('change', function (event) {
      //$('#xml_editor').html('').data({});
      loadXml(select.data('value'), select.data('text'));
    });

  });


});
/*

//  ,
//  elementUpdated: function(){CNR.log(arguments);}
 *             URL.Data.model.createModel({
              cache: false, // prevents default caching
              queue: true,
              data: {
                xml: dati // la stringa dell'xml
              },
              placeholder: {
                nameFile: nameFile, // il nome del file senza .xml
                active: booleano // true per attivare
              },
              success: function (data) {
              },
              error: function () {
              }
            });



URL.Data.model.deleteProperty({
    type: 'DELETE',
    typeName: 'faq:document',
    property: 'faq:type',
    placeholder: {
        store_type: 'workspace',
        store_id: 'SpacesStore',
        id: 'fc17bb76-dfc9-4288-9e03-b2737beb3d07',
    }

});


URL.Data.model.deleteModel({
    type: 'DELETE',
    placeholder: {
        store_type: 'workspace',
        store_id: 'SpacesStore',
        id: '0ee087f5-bdd3-407e-8310-f3361e7b1a06',
    }

});

 *
 */