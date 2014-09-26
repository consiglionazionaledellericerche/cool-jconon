/*jslint node: true */
/*global require */
/* node.js Alfresco javascript remote execution client */

var http = require('http');
var _ = require('underscore');
var fs = require('fs');

// settings
var post_options = {
  host: 'test7.si.cnr.it',
  port: '80',
  path: '/alfresco/service/cnr/utils/javascript-execution',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Basic ' + new Buffer('spaclient' + ':' + 'sp@si@n0').toString('base64')
  }
};

// read script
fs.readFile('commands.js', 'utf-8', function (err, data) {
  "use strict";
  var post_req = http.request(post_options, function(res) {
    res.setEncoding('utf8');
    res.on('data', function (chunk) {
      //console.log(chunk);
      var j = JSON.parse(chunk);
      _.each(j.logs, function (log) {
        console.log(log);
      });
      if (j.error) {
        console.error('> ERROR: ', j.error);
      } else {
        console.log("> ", j.output.content);
      }
    });
  });

  post_req.write(JSON.stringify({"command": data}));
  post_req.end();
});
