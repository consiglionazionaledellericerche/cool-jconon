require(['jquery', 'cnr/cnr.url', 'cnr/cnr.ui', 'cnr/cnr.ui.select', 'cnr/cnr', 'exceptionParser', 'xsd2json', 'header',
         'jquery.xmleditor', 'ace', 'jquery-ui', 'cycle', 'vkbeautify', "ace/range"], function ($, URL, UI, Select, CNR, expParser) {
  "use strict";

  var extractor = new Xsd2Json("/cool-jconon/res/model/modelSchema.xsd", {}),
    typeName,
    propertyName,
    nodeId,
    version,
    element,
    nomeFile,
    model,
    nodeRef = URL.querystring.from.nodeRef;

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
        'id': nodeId,
        'typeName': typeName,
        'property': propertyName
      },
      success: function (response) {
        hideProgress();
        if (response.status === 'ok') {
          UI.success("L'operazione &egrave; stata completata con successo.");
          element.removeExecute();
          location.reload();
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
  //function sendRequest(xml, generateTemplate, nameTemplate) {
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
        'id': nodeId,
        'version': version
      },
      success: function (response) {
        hideProgress();
        CNR.log(response);
        if (response.status === 'ok') {
          UI.success("L'operazione &egrave; stata completata con successo.");
        } else {
          showError(response);
          $.each(response.message, function () {});
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

  function loadXml(nodeRef, fileName) {
    var schema = extractor.getSchema()(),
      nodeParts = nodeRef.split('/');
    nodeId = nodeParts[nodeParts.length - 1].split(';')[0];
    version = nodeParts[nodeParts.length - 1].split(';')[1];
    nomeFile = fileName.substr(0, fileName.lastIndexOf('.')); // strippo il nomde del file dall'estensione

    $("#xml_editor").xmlEditor({
      schema: schema,
      loadSchemaAsychronously: false,
      promptOnDelete: ['dd:property'],
      removeTestFunc: removeTestFunc,
      ajaxOptions: {
        xmlRetrievalPath: URL.urls.search.content + "?nodeRef=" + nodeRef,
        xmlUploadPath: '/cool-jconon/rest/models',
        xmlUploadFunction: customUpdateFunction
      }
    });

  }


  model = URL.Data.node.node({
    data: {
      nodeRef: nodeRef
    }
  });

  model.done(function (response) {
    $('#header-text').append(" " + response['cmis:name']);
    nodeId = response['alfcmis:nodeRef'];
    loadXml(response['cmis:objectId'], response['cmis:contentStreamFileName']);
  });

});
