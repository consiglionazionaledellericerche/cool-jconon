define(['jquery', 'header', 'i18n', 'json!common', 'cnr/cnr.tasks', 'cnr/cnr.ui.authority', 'cnr/cnr.ui.workflow', 'datepicker-i18n'], function ($, header, i18n, common, Tasks, Authority, WorkflowWidget) {
  "use strict";
  var target = $('#workflows'),
    authorityId = 'authority',
    workflowWidget = new WorkflowWidget.Widget().appendTo('.workflowDefinitionContainer'),
    authorityWidget = new Authority.Widget(authorityId, 'Avviato da:', {jsonsettings: {usersOnly: true}});
  authorityWidget.hide().prependTo('#filters');

  if (!common.User.isAdmin) {
    authorityWidget.data('value', common.User.id);
  } else {
    authorityWidget.show();
  }

  function applyFilter() {

    var filter = {
      //completedBefore={completedBefore?},
      //completedAfter={completedAfter?},
      //maxItems
      //skipCount
    },
      authority = authorityWidget.data('value'),
      priority = $('#priority .active'),
      dueDateFrom = $('#dueDateFrom').val(),
      dueDateTo = $('#dueDateTo').val(),
      startDateFrom = $('#startDateFrom').val(),
      startDateTo = $('#startDateTo').val(),
      idWorkflow = workflowWidget ? workflowWidget.data('id') : null;

    if (authority) {
      filter.initiator = authority;
    }

    if (priority.length) {
      filter.priority = priority.data('priority');
    }

    filter.state = $('#state .active').data('state');

    if (dueDateFrom) {
      filter.dueAfter = $('#dueDateFrom').data().datepicker.date.toISOString();
    }

    if (dueDateTo) {
      filter.dueBefore = $('#dueDateTo').data().datepicker.date.toISOString();
    }

    if (startDateFrom) {
      filter.startedAfter = $('#startDateFrom').data().datepicker.date.toISOString();
    }

    if (startDateTo) {
      filter.startedBefore = $('#startDateTo').data().datepicker.date.toISOString();
    }

    if (idWorkflow) {
      filter.definitionId = idWorkflow;
    }

    window.alert("funzione disabilitata");
  }

  $('.datepicker').datepicker({
    language: i18n.locale,
    autoclose: true,
    todayHighlight: true,
    todayBtn: 'linked'
  });

  $('#applyFilter').click(function () {
    applyFilter();
    return false;
  });

  $('#resetFilter').click(function () {
    $('#priority .active').removeClass('active');
    $('#' + authorityId).val('');
    $('.datepicker').val('');
    workflowWidget.trigger('reset');
    return false;
  });

  // show workflow details in modal window
  $('#workflows').on('click', '.btn', function () {
    var props = $(this).data('properties'),
      workflowInstanceId = props.id;
    Tasks.showWorkflowDetails(workflowInstanceId, props['package'], props);
  });

});
