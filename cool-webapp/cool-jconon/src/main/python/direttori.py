"""print information about application inside a given folder"""
import cmis

# call folder: "/Selezioni on-line/2013/7"
f = 'workspace://SpacesStore/531391fc-6f1b-40c9-a153-f263c82cb8ee'

bandi = cmis.REPO.getObject(f).getChildren()

out_file = open("report-direttori.txt","w")

for bando in bandi:
  name = bando.name
  domande = cmis.REPO.query("select cmis:objectId, cmis:name, jconon_application:stato_domanda from jconon_application:folder where not jconon_application:stato_domanda = 'I' and IN_FOLDER('%s')" % bando.id)
  for domanda in domande:
    prefix = domanda.properties['jconon_application:stato_domanda'] + '\t' + domanda.name
    allegati = cmis.REPO.query("select cmis:objectId, cmis:name, cmis:contentStreamLength from cmis:document where IN_FOLDER('%s')" % domanda.id)
    for allegato in allegati:
      s = allegato.name + '\t' + str(allegato.properties['cmis:contentStreamLength'])
      content = name + '\t' + prefix + '\t' + s + '\n'
      out_file.write(content.encode('utf8'))

out_file.close()
