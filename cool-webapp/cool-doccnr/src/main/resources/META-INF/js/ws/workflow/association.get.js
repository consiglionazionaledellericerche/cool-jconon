define(['jquery', 'header', 'cnr/cnr.ui.authority', 'cnr/cnr.ui.workflow', 'i18n', 'cnr/cnr.ui', 'cnr/cnr.rbac', 'cnr/cnr.url'], function ($, header, Authority, WorkflowWidget, i18n, UI, Rbac, URL) {
  "use strict";

  var authority = new Authority.Widget('users', 'utente', {jsonsettings: {usersOnly: true}}).prependTo('#formUser'),
    workflowDefinition = new WorkflowWidget.Widget().appendTo('.workflowDefinitionContainer'),
    data = {
      method: 'GET',
      list: 'whitelist',
      type: 'user'
    };

  function getUsername() {
    return authority.data('value');
  }

  // Will only REMOVE the user from the WHITELIST.
  function disable(obj, name) {
    data.id = name;
    data.authority = getUsername();
    data.workflow = true;

    Rbac.remove(data).done(function (data) {
      obj.parents('li').remove();
      UI.success('Flusso ' + name + ' disabilitato con successo');
    });
  }

  function enable(name) {
    if (name) {
      data.id = name;
      data.authority = getUsername();
      data.workflow = true;
      Rbac.add(data).done(function (data) {
        UI.success('Flusso ' + name + ' abilitato con successo');
      });
    } else {
      UI.error('selezionare un flusso valido');
    }
  }

  function showWorkflow() {
    var username = getUsername();
    if (!username) {
      UI.error("inserire uno username valido");
    } else {
      URL.Data.filteredProcessDefinitions({
        data: {
          user: username
        }
      })
        .done(function (data) {
          var content = $('<ul class="unstyled"></ul>');

          if (Object.keys(data.definitions).length) {
            $.each(data.definitions, function (key, el) {
              var removeBtn = $('<button class="btn btn-mini btn-danger"><i class="icon-remove icon-white"></i> delete</button>')
                .click(function () {
                  disable($(this), el.name);
                });
              $('<li class="li-high">' + i18n.prop(el.title.replace(":", "_") + '.workflow.title', el.title) + '</li>')
                .prepend(' ')
                .prepend(removeBtn)
                .appendTo(content);
            });
            UI.modal("Workflow di " + getUsername(), content);
          } else {
            UI.info("L'utente non e' abilitato a nessun workflow");
          }
        });
    }
  }

  $('#enableWorkflow').click(function () {
    enable(workflowDefinition.data('name'));
    return false;
  });

  $('#showWorkflows').click(function () {
    showWorkflow();
    return false;
  });
});