/*jslint node: true */
/*global require */
/* node.js Alfresco javascript remote execution client */

var http = require('http');
var _ = require('lodash');
var fs = require('fs');

// settings
var post_options = {
  host: 'as1dock.si.cnr.it',
  port: '8080',
  path: '/alfresco/service/cnr/utils/javascript-execution',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Basic ' + new Buffer('admin' + ':' + 'admin').toString('base64')
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
