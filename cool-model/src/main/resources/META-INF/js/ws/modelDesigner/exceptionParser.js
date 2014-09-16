define(['jquery', 'cnr/cnr'], function ($, CNR) {
  "use strict";

  var parseModelDesignerError = function (serverResponse) {

    var result = $("<div></div>"), stackTraceDiv = $("<div id='mdStackTrace'></div>");

    result.append($("<div></div>").append("status: ").append($("<span>" + serverResponse.status + "</span>").addClass('mdStatus')));
    result.append($("<div></div>").append("message: ").append($("<span>" + serverResponse.message + "</span>").addClass('mdMessage')));
    result.append($("<div></div>").append("NodeRef: " + serverResponse.nodeRefModel).addClass('mdnoderef'));
    result.append($("<div></div>").append("type: " + serverResponse.type).addClass('mdtype'));
    result.append($("<div></div>").append("<a href='#'>stacktrace:</a>").addClass('mdstacktrace').click(function () {stackTraceDiv.toggle(); }));
    result.append(stackTraceDiv);

    $.each(serverResponse.stacktrace, function (a, b) {
      var curDiv = $("<div></div>").addClass("stackTraceRow");

      curDiv.append($("<span></span>").addClass("stRowNumber").append(a));
      curDiv.append($("<span></span>").addClass("stClassName").append(b.className));
      curDiv.append(".");
      curDiv.append($("<span></span>").addClass("stMethodName").append(b.methodName));
      curDiv.append("():");
      curDiv.append($("<span></span>").addClass("stLineNumber").append(b.lineNumber));

      CNR.log(a);
      CNR.log(b);

      stackTraceDiv.append(curDiv);

    });


    // div-riga
    // span className
    // span methodNumber
    // span lineNumber

    //           $.each(response.message, function () {});

    CNR.log(result);
    return result;
  };

  return {
    parseModelDesignerError: parseModelDesignerError
  };
});