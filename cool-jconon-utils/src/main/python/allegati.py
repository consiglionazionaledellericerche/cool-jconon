from cmis import REPO
from pprint import pprint

# jconon_pagamenti_diritti_segreteria:attachment


rs = REPO.query("""select cmis:objectId
  from jconon_application:folder where jconon_application:stato_domanda = 'C'
  and (IN_TREE('workspace://SpacesStore/2cd22180-7a1b-449f-a2bb-d9dac7e6b572') OR IN_TREE('workspace://SpacesStore/46e176bd-ce7b-46ab-9c79-66f60d6d2463'))""")

rs = rs[:10]

q = REPO.query("""select cmis:name
  from jconon_pagamenti_diritti_segreteria:attachment
  where IN_FOLDER('%s')""" % "', '".join)


#pprint(map(lambda x: x.getObjectParents[0].name, rs))
