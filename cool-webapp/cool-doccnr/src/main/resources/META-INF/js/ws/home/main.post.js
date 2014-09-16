define(['jquery', 'header', 'cnr/cnr.explorer'], function ($, header, Explorer) {
  "use strict";

  Explorer.init({
    dom: {
      explorerItems: $('.explorerItem'), // items to show only in file explorer mode
      search: {
        table: $('#items'),
        pagination: $('#itemsPagination'),
        orderBy: $('#orderBy'),
        label: $('#emptyResultset')
      }
    },
    search: {
      searchFunction: function (nodeRef, search) {
        var query = params.query;
        search.query(query);
      }
    }
  });

});