define(['jquery', 'json!common', 'ws/header.common'], function ($, common, headerCommon) {
  "use strict";

  headerCommon.addMenu($("#workflow"), common.workflowDefinitions, 'workflow?taskId=');

  headerCommon.arrangeSubMenus($('.navbar'));

  headerCommon.resizeNavbar(220);

});