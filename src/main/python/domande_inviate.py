import cmis

def filterApplications(application):
  type = 'jconon_attachment:application'
  items = cmis.REPO.query("select cmis:objectId, cmis:lastModificationDate from %s where IN_FOLDER('%s')" % (type,application))
  if len(items) < 1:
    print application.id + ' non ha %s' % type 
  elif len(items) > 1:
    print application.id + ' ha troppi %s ' % type
  else:
    lastModificationDate = items[0].properties['cmis:lastModificationDate']
    dataDomanda = application.properties['jconon_application:data_domanda']
    if (lastModificationDate-dataDomanda).total_seconds() < 0:
      print lastModificationDate
      print dataDomanda
      return True
  return False


def analizzaBando(bando):
  rs = cmis.REPO.query("select cmis:objectId, jconon_application:data_domanda from jconon_application:folder where IN_TREE('%s') and jconon_application:stato_domanda = 'C'" % bando)
  print str(len(rs)) + ' domande'
  applications = filter(filterApplications, rs)
  print map(lambda application : application.id, applications)



bandi = ['BANDO 364.172', 'BANDO 364.173']

for bando in bandi:
  id = cmis.REPO.query("select cmis:objectId from jconon_call:folder where cmis:name='%s'" % bando)[0].id
  print bando + ' ' + id
  analizzaBando(id)

