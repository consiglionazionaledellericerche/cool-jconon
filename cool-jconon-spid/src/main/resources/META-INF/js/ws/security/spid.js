/*global params*/
define(['jquery'], function ($) {
  "use strict";
  $(window).on('popstate', function (e) {
      var state = e.originalEvent.state;
      if (state !== null) {
          return;
      }
  });
  $('#mainForm').submit();
});