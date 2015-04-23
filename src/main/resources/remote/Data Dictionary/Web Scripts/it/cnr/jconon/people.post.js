/*global cnrutils,logger,requestbody,jsonUtils */

(function () {
  "use strict";

  var defaultMapping = {
    "version": "1.4",
    "props": {
      "{http://www.cnr.it/model/cvelement/1.0}abilitazioneProfessionale": "altre_info",
      "{http://www.cnr.it/model/cvelement/1.0}alboIscrizione": "altre_info",
      "{http://www.cnr.it/model/cvelement/1.0}altraStruttura": "altre_info",
      "{http://www.cnr.it/model/cvelement/1.0}altraTipologiaOrganismo": "altre_info",
      "{http://www.cnr.it/model/cvelement/1.0}altreInformazioni": "altre_info",
      "{http://www.cnr.it/model/cvelement/1.0}altriPartner": "org_coinvolte",
      "{http://www.cnr.it/model/cvelement/1.0}altroAttoConferimento": "altre_info",
      "{http://www.cnr.it/model/cvelement/1.0}altroRuoloIncarico": "ruolo",
      "{http://www.cnr.it/model/cvelement/1.0}altroRuoloProgetto": "ruolo",
      "{http://www.cnr.it/model/cvelement/1.0}argomento": "descr",
      "{http://www.cnr.it/model/cvelement/1.0}attivitainCorso": "attivita_incorso",
      "{http://www.cnr.it/model/cvelement/1.0}attivitaSvolta": "descr",
      "{http://www.cnr.it/model/cvelement/1.0}attoConferimento": "altre_info",
      "{http://www.cnr.it/model/cvelement/1.0}congresso": "descr",
      "{http://www.cnr.it/model/cvelement/1.0}congressoIstituzione": "descr",
      "{http://www.cnr.it/model/cvelement/1.0}data": "altre_info",
      "{http://www.cnr.it/model/cvelement/1.0}dataAbilitazione": "altre_info",
      "{http://www.cnr.it/model/cvelement/1.0}dataIscrizione": "altre_info",
      "{http://www.cnr.it/model/cvelement/1.0}dataRiferimento": "altre_info",
      "{http://www.cnr.it/model/cvelement/1.0}denominazioneIncarico": "titolo",
      "{http://www.cnr.it/model/cvelement/1.0}denominazioneIstituto": "titolo",
      "{http://www.cnr.it/model/cvelement/1.0}denominazioneStruttura": "org_coinvolte",
      "{http://www.cnr.it/model/cvelement/1.0}descrizionePartecipazione": "titolo",
      "{http://www.cnr.it/model/cvelement/1.0}descrizionePremio": "titolo",
      "{http://www.cnr.it/model/cvelement/1.0}dettagli": "altre_info",
      "{http://www.cnr.it/model/cvelement/1.0}dimensioniStruttura ": "altre_info",
      "{http://www.cnr.it/model/cvelement/1.0}entitaEconomicaLavori": "altre_info",
      "{http://www.cnr.it/model/cvelement/1.0}finalita": "descr",
      "{http://www.cnr.it/model/cvelement/1.0}finalitaProgetto": "descr",
      "{http://www.cnr.it/model/cvelement/1.0}importoFinanziamentoUO": "altre_info",
      "{http://www.cnr.it/model/cvelement/1.0}importototFinanziamento": "altre_info",
      "{http://www.cnr.it/model/cvelement/1.0}istituzioneAssegnataria": "descr",
      "{http://www.cnr.it/model/cvelement/1.0}materiaInsegnamento": "titolo",
      "{http://www.cnr.it/model/cvelement/1.0}nominativoResponsabile": "altre_info",
      "{http://www.cnr.it/model/cvelement/1.0}nominativoStudente": "altre_info",
      "{http://www.cnr.it/model/cvelement/1.0}numeroContratto": "altre_info",
      "{http://www.cnr.it/model/cvelement/1.0}numeroRegistro": "altre_info",
      "{http://www.cnr.it/model/cvelement/1.0}numeroRiferimento": "altre_info",
      "{http://www.cnr.it/model/cvelement/1.0}obiettivi": "descr",
      "{http://www.cnr.it/model/cvelement/1.0}obiettiviRaggiunti": "descr",
      "{http://www.cnr.it/model/cvelement/1.0}periodAttivitaAl": "attivita_al",
      "{http://www.cnr.it/model/cvelement/1.0}periodAttivitaDal": "attivita_dal",
      "{http://www.cnr.it/model/cvelement/1.0}risultatiOttenuti": "descr",
      "{http://www.cnr.it/model/cvelement/1.0}rivista": "titolo",
      "{http://www.cnr.it/model/cvelement/1.0}ruoloIncarico": "ruolo",
      "{http://www.cnr.it/model/cvelement/1.0}ruoloProgetto": "ruolo",
      "{http://www.cnr.it/model/cvelement/1.0}sede": "luogo",
      "{http://www.cnr.it/model/cvelement/1.0}sedeIstituto": "altre_info",
      "{http://www.cnr.it/model/cvelement/1.0}tipologiaCorso": "altre_info",
      "{http://www.cnr.it/model/cvelement/1.0}tipologiaFinanziamento": "altre_info",
      "{http://www.cnr.it/model/cvelement/1.0}tipologiaOrganismo": "altre_info",
      "{http://www.cnr.it/model/cvelement/1.0}tipoStruttura": "altre_info",
      "{http://www.cnr.it/model/cvelement/1.0}titoloEvento": "titolo",
      "{http://www.cnr.it/model/cvelement/1.0}titoloProgetto": "titolo",
      "{http://www.cnr.it/model/cvelement/1.0}oreComplessive": "altre_info",
      "{http://www.cnr.it/model/cvelement/1.0}anno": false,
      "{http://www.cnr.it/model/cvelement/1.0}attivitaInterNazionale": false,
      "{http://www.cnr.it/model/cvelement/1.0}motivazione": false,
      "{http://www.cnr.it/model/cvelement/1.0}progressivoOrdinamento": false,
      "{http://www.cnr.it/model/cvelement/1.0}sottoSezioneId": false
    },
    "types": {
      "{http://www.cnr.it/model/cvelement/1.0}attivita_incarichi_tecnologo": "ad_personam",
      "{http://www.cnr.it/model/cvelement/1.0}attivita_professionale_tecnologo": "altro",
      "{http://www.cnr.it/model/cvelement/1.0}cdaCollegiSindacali": "consiglio_amm",
      "{http://www.cnr.it/model/cvelement/1.0}comitato": "comitato",
      "{http://www.cnr.it/model/cvelement/1.0}comitato_ricercatore": "comitato",
      "{http://www.cnr.it/model/cvelement/1.0}comitato_tecnologo": "comitato",
      "{http://www.cnr.it/model/cvelement/1.0}commissione": "gruppo_lavoro",
      "{http://www.cnr.it/model/cvelement/1.0}commissione_ricercatore": "gruppo_lavoro",
      "{http://www.cnr.it/model/cvelement/1.0}commissione_tecnologo_partecipante": "gruppo_lavoro",
      "{http://www.cnr.it/model/cvelement/1.0}commissione_tecnologo_responsabile": "gruppo_lavoro",
      "{http://www.cnr.it/model/cvelement/1.0}congresso": "evento",
      "{http://www.cnr.it/model/cvelement/1.0}congresso_ricercatore": "evento",
      "{http://www.cnr.it/model/cvelement/1.0}congresso_tecnologo": "evento",
      "{http://www.cnr.it/model/cvelement/1.0}direzioneResponsabilita": "resp_strutture",
      "{http://www.cnr.it/model/cvelement/1.0}docenza": "didattica",
      "{http://www.cnr.it/model/cvelement/1.0}docenza_ricercatore": "didattica",
      "{http://www.cnr.it/model/cvelement/1.0}docenza_tecnologo": "didattica",
      "{http://www.cnr.it/model/cvelement/1.0}incarico_ricercatore": "resp_strutture",
      "{http://www.cnr.it/model/cvelement/1.0}incarico_tecnologo": "resp_strutture",
      "{http://www.cnr.it/model/cvelement/1.0}incaricoAdpersonam": "ad_personam",
      "{http://www.cnr.it/model/cvelement/1.0}incaricoProfessionale": "altro",
      "{http://www.cnr.it/model/cvelement/1.0}premio": "premi",
      "{http://www.cnr.it/model/cvelement/1.0}premio_ricercatore_ercgrant": "erc_grant",
      "{http://www.cnr.it/model/cvelement/1.0}premio_ricercatore_istituzioni": "premi",
      "{http://www.cnr.it/model/cvelement/1.0}premio_ricercatore_lezionimagistrali": "evento",
      "{http://www.cnr.it/model/cvelement/1.0}premio_ricercatore_programchair": "evento",
      "{http://www.cnr.it/model/cvelement/1.0}premioErcGrant": "erc_grant",
      "{http://www.cnr.it/model/cvelement/1.0}progetto": "progetto_comm_mod",
      "{http://www.cnr.it/model/cvelement/1.0}progetto_ricercatore_partecipante": "progetto_comm_mod",
      "{http://www.cnr.it/model/cvelement/1.0}progetto_ricercatore_responsabile": "progetto_comm_mod",
      "{http://www.cnr.it/model/cvelement/1.0}progetto_tecnologo_partecipante": "progetto_comm_mod",
      "{http://www.cnr.it/model/cvelement/1.0}progetto_tecnologo_responsabile": "progetto_comm_mod",
      "{http://www.cnr.it/model/cvelement/1.0}progettoPartecipazione": "progetto_comm_mod",
      "{http://www.cnr.it/model/cvelement/1.0}riconoscimento": "premi",
      "{http://www.cnr.it/model/cvelement/1.0}riconoscimento2": "premi",
      "{http://www.cnr.it/model/cvelement/1.0}tutor_ricercatore": "tutor",
      "{http://www.cnr.it/model/cvelement/1.0}tutoraggio": "tutor"
    },
    "replacer": {
      "{http://www.cnr.it/model/cvelement/1.0}tipoStruttura": {
        "regex": "_",
        "replacement": " "
      },
      "{http://www.cnr.it/model/cvelement/1.0}attoConferimento": {
        "regex": "_",
        "replacement": " "
      },
      "{http://www.cnr.it/model/cvelement/1.0}ruoloIncarico": {
        "regex": "_",
        "replacement": " "
      },
      "{http://www.cnr.it/model/cvelement/1.0}ruoloProgetto": {
        "regex": "_",
        "replacement": " "
      },
      "{http://www.cnr.it/model/cvelement/1.0}tipologiaOrganismo": {
        "regex": "_",
        "replacement": " "
      }
    },
    "exclusions": {
      "{http://www.cnr.it/model/cvelement/1.0}tipoStruttura": [
        "Altro"
      ],
      "{http://www.cnr.it/model/cvelement/1.0}tipologiaOrganismo": [
        "Altro"
      ],
      "{http://www.cnr.it/model/cvelement/1.0}ruoloProgetto": [
        "Altro"
      ],
      "{http://www.cnr.it/model/cvelement/1.0}ruoloIncarico": [
        "Altro"
      ],
      "{http://www.cnr.it/model/cvelement/1.0}attoConferimento": [
        "Altro",
        "Atto privo di numerazione",
        "Non disponibile"
      ]
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

  function sortFn(a, b) {

    var x = a.tipo_attivita.label_selonline,
      y = b.tipo_attivita.label_selonline;

    if (x > y) {
      return 1;
    } else if (x < y) {
      return -1;
    } else {
      return 0;
    }

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
            } else if (k && k !== 'altre_info') {
              if (k === 'descr') {
                ps[k].push(item);
              } else {
                ps[k] = item;

              }
            } else {

              if (p.indexOf('cvelement') < 0 || k === false) {
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
            valore: mapping.types[type] || 'altro',
            label_selonline: getType(type).title
          },
          properties: ps
        });

      }

    }

    return {
      rows: out.sort(sortFn),
      'mapping-version': mapping.version
    };

  }

  json = jsonUtils.toObject(requestbody.content);

  result = main(json.nodeRef, json.mapping || defaultMapping);

  model.json = jsonUtils.toJSONString(result);


}());


// curl -ujconon:jcononpw -X POST http://as1dock.si.cnr.it:8080/alfresco/service/cnr/jconon/manage-application/people-cvelements -H'Content-type: application/json' --data '{"nodeRef": "workspace://SpacesStore/4c7b03f1-e0be-4112-b2b8-e425980b2b1d", "mapping":{"version": "2.5", "props":{"foo": "bar"}}}' | jq '[.]'
