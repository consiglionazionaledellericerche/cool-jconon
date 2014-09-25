define(['jquery', 'header', 'cnr/cnr.explorer'], function ($, header, Explorer) {
  "use strict";


  Explorer.init({
    dom: {
      explorerItems: $('.explorerItem'), // items to show only in file explorer mode
      tree: $('#collection-tree'),
      breadcrumb: $('.breadcrumb'),
      buttons: {
        createFolder: $('#createFolder'),
        uploadDocument: $('#uploadDocument'),
        paste: $('#paste')
      },
      search: {
        table: $('#items'),
        pagination: $('#itemsPagination'),
        orderBy: $('#orderBy'),
        label: $('#emptyResultset')
      }
    }
  });

});