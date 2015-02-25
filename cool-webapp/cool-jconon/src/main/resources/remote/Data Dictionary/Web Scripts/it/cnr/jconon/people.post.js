/*global cnrutils */
function main (nodeRef, mapping) {

  "use strict";
  var d = cnrutils.getBean('dictionaryService');

  var LIMIT = 12;

  var application = search.findNode(nodeRef);

  var rows = application.children;


  var out = [];

  function getItem (p) {
    return {
      valore: value,
      codice_selonline: p,
      label_selonline: propertyTitle(p).title
    };
  }

  function propertyTitle (s) {
    var q = cnrutils.executeStatic('org.alfresco.service.namespace.QName.createQName', s);
    return d.getProperty(q);
  }


  function typeTitle (s) {
    var q = cnrutils.executeStatic('org.alfresco.service.namespace.QName.createQName', s);
    return d.getType(q);
  }


  for (var i = 0; i < rows.length && i < LIMIT; i++) {

    var row = rows[i];

    var type = row.type;

    if (type.indexOf('cvelement') < 0) {
      logger.info('escludo ' + type);
      continue;
    }

    var ps = {
      altre_info: []
    };

    for(p in row.properties) {

      var value = row.properties[p];
      var k = mapping.props[p];

      if (k) {
        ps[k] = getItem(p);
      } else {
        if (p.indexOf('cvelement') < 0) {
          logger.info("--- escludo property " + p);
        } else {
          ps['altre_info'].push(getItem(p));
        }

      }
    }

    out.push({
      tipo_attivita: {
        codice_selonline: type,
        valore: '???',
        label_selonline: typeTitle(type).title
      },
      properties: ps
    });

  }

  return {
    rows: out,
    'mapping-version': mapping.version
  };

}


var json = jsonUtils.toObject(requestbody.content);


var defaultMapping = {
  version: '1.0',
    props: {
    "{http://www.cnr.it/model/cvelement/1.0}ruoloIncarico": "incarico",
    "{http://www.cnr.it/model/cvelement/1.0}attivitainCorso": "attivita_incorso",
    "{http://www.cnr.it/model/cvelement/1.0}periodAttivitaDal": "attivita_al"
    }
};

var mapping = json.mapping || defaultMapping;

model.json = jsonUtils.toJSONString(main(json.nodeRef, mapping));

// curl -ujconon:jcononpw -X POST http://as1dock.si.cnr.it:8080/alfresco/service/cnr/jconon/manage-application/people-cvelements -H'Content-type: application/json' --data '{"nodeRef":"workspace://SpacesStore/4c7b03f1-e0be-4112-b2b8-e425980b2b1d", "mapping":{"version":"2.5", "props":{"foo":"bar"}}}' | jq '[.]'
