"""find empty PDFs"""
import cmis 

query = """select *
  from jconon_attachment:document
  where cmis:contentStreamLength = 0
  order by cmis:objectTypeId desc"""

limit = 20

rs = cmis.REPO.query(query, maxItems=str(limit))

if len(rs) == limit:
  print 'INCREASE LIMIT !!!'

def fn(item):
  return item.getProperties().get('cmis:name').lower().find('pdf') >= 0

pdfs = filter(fn, rs)

for pdf in pdfs:
  print pdf.getProperties().get('cmis:name') + d.getObjectParents()[0].getPaths()[0]
