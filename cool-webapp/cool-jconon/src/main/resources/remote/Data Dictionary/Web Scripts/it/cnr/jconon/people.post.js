/*global cnrutils,logger,requestbody,jsonUtils */
function main(nodeRef, mapping) {

  "use strict";
  var d = cnrutils.getBean('dictionaryService'),
    application = search.findNode(nodeRef),
    rows = application.children,
    out = [],
    i,
    row,
    type,
    ps,
    p,
    value,
    k,
    item;


  function propertyTitle(s) {
    var q = cnrutils.executeStatic('org.alfresco.service.namespace.QName.createQName', s);
    return d.getProperty(q);
  }


  function typeTitle(s) {
    var q = cnrutils.executeStatic('org.alfresco.service.namespace.QName.createQName', s);
    return d.getType(q);
  }


  for (i = 0; i < rows.length; i++) {

    row = rows[i];
    type = row.type;

    if (type.indexOf('cvelement') < 0) {
      logger.info('escludo ' + type);
    } else {

      ps = {
        altre_info: [],
        descr: []
      };


      for (p in row.properties) {
        if (row.properties.hasOwnProperty(p)) {
          value = row.properties[p];
          k = mapping.props[p];

          item = {
            valore: value,
            codice_selonline: p,
            label_selonline: propertyTitle(p).title
          };

          if (k) {
            if (k === 'descr') {
              ps[k].push(item);
            } else {
              ps[k] = item;

            }
          } else {
            if (p.indexOf('cvelement') < 0) {
              logger.info("--- escludo property " + p);
            } else {
              ps.altre_info.push(item);
            }

          }
        }

      }

      out.push({
        tipo_attivita: {
          codice_selonline: type,
          valore: mapping.types[type] || null,
          label_selonline: typeTitle(type).title
        },
        properties: ps
      });

    }

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
    "{http://www.cnr.it/model/cvelement/1.0}periodAttivitaDal": "attivita_al",
    "{http://www.cnr.it/model/cvelement/1.0}attivitaSvolta": "descr",
    "{http://www.cnr.it/model/cvelement/1.0}dettagli": "descr"
  },
  types: {
    "{http://www.cnr.it/model/cvelement/1.0}commissione": "gruppo_lavoro",
    "{http://www.cnr.it/model/cvelement/1.0}riconoscimento": "premi"
  }
};

var mapping = json.mapping || defaultMapping;

model.json = jsonUtils.toJSONString(main(json.nodeRef, mapping));

// curl -ujconon:jcononpw -X POST http://as1dock.si.cnr.it:8080/alfresco/service/cnr/jconon/manage-application/people-cvelements -H'Content-type: application/json' --data '{"nodeRef":"workspace://SpacesStore/4c7b03f1-e0be-4112-b2b8-e425980b2b1d", "mapping":{"version":"2.5", "props":{"foo":"bar"}}}' | jq '[.]'
