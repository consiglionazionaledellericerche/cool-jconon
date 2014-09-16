require(['jquery', 'cnr/cnr.tasks', 'cnr/cnr.url', 'header'], function ($, Tasks, URL) {
  "use strict";

  // display tasks
  Tasks.init({
    elements: {
      myTasks: $('#myTasks'),
      assigned: $('#assignedTasks'),
      taskFilters: $('#taskFilters')
    }
  });

  Tasks.display();

});