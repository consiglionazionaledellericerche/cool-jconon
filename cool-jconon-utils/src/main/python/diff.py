import httppost
import cmis

def getNames(callName):
  rs = cmis.REPO.query("select cmis:name from jconon_application:folder where IN_TREE('%s')" %  httppost.getCallId(callName))
  return map(lambda x: x.name, rs)

#e.g. 'BANDO 364.143 A'
def diff(a, b):
  s1 = getNames(a)
  s2 = getNames(b)
  return list(set(s1) - set(s2))
