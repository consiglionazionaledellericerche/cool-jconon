"""Recupera la descrizione ridotta dei bandi"""
import cmis 

query = """select cmis:objectId objectId, jconon_call:descrizione_ridotta descrizione 
	from jconon_call:folder where jconon_call:descrizione_ridotta is not null"""

limit = 500
bandi = {}

calls = cmis.REPO.query(query, maxItems=str(limit))
print str(len(calls)) + ' bandi'
for call in calls:	
  bandi[call.properties['cmis:objectId']] = call.properties['jconon_call:descrizione_ridotta']

raw_input("Ripulire la property con lo script, aggiornare il modello e poi premere enter per valorizzare le descrizioni.")
for bando in bandi:
	print bando + " - " + bandi[bando]
	cmis.REPO.getObject(bando).updateProperties({'jconon_call:descrizione_ridotta': bandi[bando]})