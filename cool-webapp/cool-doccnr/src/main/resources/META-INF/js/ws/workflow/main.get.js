define(['jquery', 'header', 'cnr/cnr', 'i18n', 'cnr/cnr.ui', 'cnr/cnr.bulkinfo', 'cnr/cnr.explorer', 'cnr/cnr.url', 'cnr/cnr.criteria', 'json!cache', 'cnr/cnr.tasks', 'datepicker-i18n'], function ($, header, CNR, i18n, UI, BulkInfo, Explorer, URL, Criteria, cache, Tasks) {

  "use strict";

  var processName, table, selected, sel = $("#selected"), bulkinfo;


  $('#dueDate').datepicker({
    language: i18n.locale,
    autoclose: true,
    startDate: CNR.Date.yesterday(),
    todayHighlight: true,
    todayBtn: 'linked'
  });

  // show the detail of selected process definition
  URL.Data.proxy.processDefinition({
    placeholder: {
      workflowDefinitionId: URL.querystring.from.taskId
    },
    success: function (definition) {
      var process = definition.data, diagramUrl = URL.template(URL.urls.proxy.definitionDiagram, {workflowDefinitionId: process.id});
      $("#processTitle").text(i18n.prop(process.title.replace(":", "_") + '.workflow.title', process.title));
      $("#processDescription")
        .text(i18n.prop(process.title.replace(":", "_") + '.workflow.description', process.description))
        .after('<img src="' + diagramUrl + '" class="workflowDiagram" title="' + (process.title || "") + '" />');
      bulkinfo = new BulkInfo({
        target: $('#workflowInput'),
        path: 'D:' + process.startTaskDefinitionType
      });
      bulkinfo.render();
      processName = process.name;
    }
  });


  // inizializzazione del pannello di ricerca per la selezione dei documenti
  table = $("#items");
  selected = {};

  function removeSelected(nodeRef) {
    $(selected[nodeRef]).remove();
    delete selected[nodeRef];
  }

  function getItem(name, nodeRef, singleItem) {
    var el = $('<tr data-id="' + nodeRef + '"></tr>').appendTo(sel),
      td1 = $('<td></td>').appendTo(el),
      td2 = $('<td>' + name + '</td>').appendTo(el),
      btn = $('<button type="button" class="btn btn-mini btn-danger">' + i18n.remove + '</button>');

    if (!singleItem) {
      btn
        .appendTo(td1)
        .on("click", function () {
          removeSelected(nodeRef);
          table.find('button[data-noderef="' + nodeRef.replace(/([:\/;\.])/g, '\\$1') + '"]').removeClass("active");
        });
    }

    return el;
  }

  if (URL.querystring.from.nodeRef) {
    // simple workflow, nodeRef received as querystring parameter
    selected[URL.querystring.from.nodeRef] = getItem(decodeURIComponent(URL.querystring.from.name), URL.querystring.from.nodeRef, true);
  } else {

    Explorer.init({
      dom: {
        breadcrumb: $('.breadcrumb'),
        tree: $('#collection-tree'),
        search: {
          table: table,
          pagination: $('#itemsPagination'),
          orderBy: $('#orderBy'),
          label: $('#emptyResultset')
        }
      },
      search: {
        display: {
          row: function (el) {
            var row = $('<tr><td><button type="button" class="btn btn-mini" data-name="' + el.name + '" data-noderef="' + el.id + '" data-toggle="button">' + i18n.select + '</button></td><td>' + el.name + '</td></tr>');
            if (selected.hasOwnProperty(el.id)) {
              row.find("button").addClass("active");
            }
            return row;
          },
          after: function () {
            table.find("button").on("click", function () {
              var data = $(this).data(),
                nodeRef = data.noderef,
                el;

              if (selected.hasOwnProperty(nodeRef)) {
                removeSelected(nodeRef);
              } else {
                el = getItem(data.name, nodeRef);
                selected[nodeRef] = el;
              }
            });
          }
        },
        searchFunction: function (nodeRef, search, isRoot) {
          var nested;
          if (isRoot) {
            nested = new Criteria().inTree(cache.dataDictionary).build();
            new Criteria().not(nested).list(search);
          } else {
            search.displayDocs(nodeRef, true);
          }
        }
      }
    });

  }



  $("#startWorkflow").on("click", function (event) {
    var btn = $(event.target),
      nodes,
      formData;

    if (!bulkinfo.validate()) {
      UI.alert("alcuni campi non sono corretti");
    } else {
      nodes = $.map(selected, function (value, key) {
        return key.replace(/;[a-zA-Z0-9\\.]*/g, '');
      }).join(',');

      formData = bulkinfo.getData();
      Tasks.startWorkflow(btn, nodes, formData, processName);
    }
  });

});