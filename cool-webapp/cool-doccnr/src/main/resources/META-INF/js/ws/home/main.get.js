define(['jquery', 'header', 'cnr/cnr.explorer', 'cnr/cnr'], function ($, header, Explorer, CNR) {
  "use strict";

  CNR.Storage.set('nodeRefToCopy', '');
  CNR.Storage.set('nodeRefToCut', '');

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