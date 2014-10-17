'use strict';

angular.module('flowsApp')
  .factory('modalService', function () {

    function modal (modalTitle, bodyContent) {

      var modalContent = $('<div class="modal-content"></div>');

      if (modalTitle) {
        $('<div class="modal-header"></div>')
          .append('<button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>')
          .append('<h4 class="modal-title">' + modalTitle + '</h4>')
          .appendTo(modalContent);
      }

      $('<div class="modal-body"></div>')
        .append(bodyContent)
        .appendTo(modalContent);

      $('<div class="modal-footer"></div>')
        .append('<button type="button" class="btn btn-default" data-dismiss="modal">Chiudi</button>')
        .appendTo(modalContent);

      return $('<div class="modal-dialog modal-sm"></div>').append(modalContent);

    }

    return {
      modal: modal
    };

  });