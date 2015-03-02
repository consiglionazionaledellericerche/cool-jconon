/*global cnrutils,logger,requestbody,jsonUtils */

(function () {
  "use strict";

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
    replacer: {
      "{http://www.cnr.it/model/cvelement/1.0}ruoloProgetto": {
        regex: "_",
        replacement: " "
      }
    },
    exclusions: {
      "{http://www.cnr.it/model/cvelement/1.0}tipoStruttura": ["Altro"],
      "{http://www.cnr.it/model/cvelement/1.0}tipologiaOrganismo": ["Altro"],
      "{http://www.cnr.it/model/cvelement/1.0}ruoloProgetto": ["Altro"],
      "{http://www.cnr.it/model/cvelement/1.0}ruoloIncarico": ["Altro"],
      "{http://www.cnr.it/model/cvelement/1.0}attoConferimento": ["altro", "Atto_privo_di_numerazione", "Non_disponibile"]
    }
  },
    d = cnrutils.getBean('dictionaryService'),
    json,
    result;


  function getProperty(s) {
    var q = cnrutils.executeStatic('org.alfresco.service.namespace.QName.createQName', s);
    return d.getProperty(q);
  }


  function getType(s) {
    var q = cnrutils.executeStatic('org.alfresco.service.namespace.QName.createQName', s);
    return d.getType(q);
  }

  function isValueExcluded(exclusion, valore) {
    return exclusion ? (exclusion.indexOf(valore) >= 0) : false;

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
      item,
      myProp,
      replacer,
      valore;


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

            myProp = getProperty(p);

            replacer = mapping.replacer[p];
            valore = replacer ? value.replace(new RegExp(replacer.regex, "g"), replacer.replacement) : value;

            item = {
              valore: valore,
              type: myProp.dataType.javaClassName,
              codice_selonline: p,
              label_selonline: myProp.title
            };

            if (isValueExcluded(mapping.exclusions[p], valore)) {
              logger.info("--- escludo property " + p);
            } else if (k) {
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

  json = jsonUtils.toObject(requestbody.content);

  result = main(json.nodeRef, json.mapping || defaultMapping);

  model.json = jsonUtils.toJSONString(result);


}());


// curl -ujconon:jcononpw -X POST http://as1dock.si.cnr.it:8080/alfresco/service/cnr/jconon/manage-application/people-cvelements -H'Content-type: application/json' --data '{"nodeRef":"workspace://SpacesStore/4c7b03f1-e0be-4112-b2b8-e425980b2b1d", "mapping":{"version":"2.5", "props":{"foo":"bar"}}}' | jq '[.]'
