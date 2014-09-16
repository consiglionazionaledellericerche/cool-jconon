"""print applications summary"""
import cmis 

#bandi = ['BANDO 364.172', 'BANDO 364.173', 'BANDO 364.145', 'BANDO 364.146']
bandi = ['BANDO 364.174']
stati = {"P": "Provvisoria", "C": "Confermata"}

query = """select cmis:objectId
  from jconon_call:folder
  where cmis:name = '%s'"""

queryApplications = """select cmis:objectId
  from jconon_application:folder
  where IN_TREE('%s') and jconon_application:stato_domanda = '%s'"""

def count():
  result = ''
  for bando in bandi:
    nodeRef = cmis.REPO.query(query % bando)[0].id
    result += '\n' + bando + '\n'
    for stato in stati:
      rs = cmis.REPO.query(queryApplications % (nodeRef, stato))
      result += stati[stato] + ' ' + str(len(rs)) + '\n'
  print result
  return result

count()
