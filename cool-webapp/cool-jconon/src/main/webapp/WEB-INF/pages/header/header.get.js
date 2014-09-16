var temp = sitedata.getPages(), page, p;

model.pages = [];

for (page in temp) {
	if (temp.hasOwnProperty(page)) {
	  p = temp[page];
    var formatId = p.properties["format-id"];
    if (formatId && formatId.indexOf("navbar") === 0) {
	    model.pages.push(p);
	  }
	}
}
model.pages.sort(function (a, b) {
	"use strict";
	return parseInt(a.properties['order-id'], 10) > parseInt(b.properties['order-id'], 10);
});
