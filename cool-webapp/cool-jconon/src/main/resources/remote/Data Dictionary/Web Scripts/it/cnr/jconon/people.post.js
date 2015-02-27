/*global cnrutils,logger,requestbody,jsonUtils */

(function () {
  "use strict";

  var d = cnrutils.getBean('dictionaryService');

  var defaultMapping = {
    version: '1.2',
    props: {
      "{http://www.cnr.it/model/cvelement/1.0}ruoloIncarico": "ruolo",
      "{http://www.cnr.it/model/cvelement/1.0}attivitainCorso": "attivita_incorso",
      "{http://www.cnr.it/model/cvelement/1.0}periodAttivitaDal": "attivita_dal",
      "{http://www.cnr.it/model/cvelement/1.0}periodAttivitaAl": "attivita_al",
      "{http://www.cnr.it/model/cvelement/1.0}attivitaSvolta": "descr",
      "{http://www.cnr.it/model/cvelement/1.0}dettagli": "descr",
      "{http://www.cnr.it/model/cvelement/1.0}:titoloProgetto": "titolo",
      "{http://www.cnr.it/model/cvelement/1.0}progressivoOrdinamento": false
    },
    types: {
      "{http://www.cnr.it/model/cvelement/1.0}commissione": "gruppo_lavoro",
      "{http://www.cnr.it/model/cvelement/1.0}riconoscimento": "premi"
    },
    mapper: {
      "{http://www.cnr.it/model/cvelement/1.0}ruoloProgetto": {
        regex: "_",
        replacement: " "
      }
    }
  };


  function getProperty(s) {
    var q = cnrutils.executeStatic('org.alfresco.service.namespace.QName.createQName', s);
    return d.getProperty(q);
  }


  function getType(s) {
    var q = cnrutils.executeStatic('org.alfresco.service.namespace.QName.createQName', s);
    return d.getType(q);
  }


  function main(nodeRef, mapping) {

    var application = search.findNode(nodeRef),
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

            var myProp = getProperty(p);

            var K = mapping.mapper[p];
            var valore = K ? value.replace(new RegExp(K.regex, "g"), K.replacement) : value;

            item = {
              valore: valore,
              type: myProp.dataType.javaClassName,
              codice_selonline: p,
              label_selonline: myProp.title
            };

            if (k) {
              if (k === 'descr') {
                ps[k].push(item);
              } else {
                ps[k] = item;

              }
            } else {

              if (p.indexOf('cvelement') < 0 || mapping.props[p] === false) {
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
            label_selonline: getType(type).title
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

  var mapping = json.mapping || defaultMapping;

  var result = main(json.nodeRef, mapping);

  model.json = jsonUtils.toJSONString(result);


}());


// curl -ujconon:jcononpw -X POST http://as1dock.si.cnr.it:8080/alfresco/service/cnr/jconon/manage-application/people-cvelements -H'Content-type: application/json' --data '{"nodeRef":"workspace://SpacesStore/4c7b03f1-e0be-4112-b2b8-e425980b2b1d", "mapping":{"version":"2.5", "props":{"foo":"bar"}}}' | jq '[.]'
