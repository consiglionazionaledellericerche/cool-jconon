"""informazioni domande provvisorie"""

from cmis import REPO

rs =  REPO.query("select cmis:objectId, cmis:lastModificationDate, jconon_application:user from jconon_application:folder where jconon_application:stato_domanda = 'P' and (IN_TREE('workspace://SpacesStore/7645ea7d-c669-4cb7-a647-8ca01fc312fe') or IN_TREE('workspace://SpacesStore/781d068b-2dc7-479b-ad4c-18f5a75db581'))")

print str(len(rs)) + ' domande provvisorie'

users = map(lambda x: x.properties['jconon_application:user'], rs)

print str(len(set(users))) + ' utenti diversi hanno domande provvisorie'

#for user in users:
#  print user

for d in map(lambda x: x.properties['cmis:lastModificationDate'].isoformat(), rs):
  print d

