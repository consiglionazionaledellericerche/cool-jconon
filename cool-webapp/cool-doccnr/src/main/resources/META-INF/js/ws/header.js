define(['jquery', 'json!common', 'ws/header.common'], function ($, common, headerCommon) {
  "use strict";

  headerCommon.arrangeSubMenus($('.navbar'));

  headerCommon.resizeNavbar(220);

});