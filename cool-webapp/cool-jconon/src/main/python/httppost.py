"""Copy applications between different calls"""
import urllib2
import urllib
import base64
import json
import completion # pylint: disable=W0611
import cmis

url = cmis.HOST + '/service/manage-application/paste'

def dopost(data):
  # Send HTTP POST request
  request = urllib2.Request(url, json.dumps(data), {'Content-Type': 'application/json'})

  base64string = base64.encodestring('%s:%s' % (cmis.USER, cmis.PASSW)).replace('\n', '')
  request.add_header("Authorization", "Basic %s" % base64string)   

  try: 
    response = urllib2.urlopen(request)
    return response
  except:
    print 'ERRORE ' + data['applicationSourceId']


def getApplications(callId):
  rs = cmis.REPO.query("select cmis:objectId from jconon_application:folder where IN_TREE('%s')" % callId)
  ids = map(lambda x:x.id, rs)
  return ids

# copia domande da sourceId a targetId
def copyApplicationsByCallId(sourceId, targetId):
  ids = getApplications(sourceId)
  count = 0
  for id in ids:
    data = {
      "callTargetId": targetId,
      "applicationSourceId": id,
      "contributorToUser": False
    }
    #print data
    count = count + 1;
    print str(count) + ' di ' + str(len(ids)) + ': ' + id
    dopost(data)
  return ids


# e.g. 'BANDO 364.143 B'
def getCallId(callName):
  rs = cmis.REPO.query("select cmis:objectId from jconon_call:folder where cmis:name = '%s'" % callName)
  if len(rs) < 1:
    raise Exception('No call found for name: ' + callName)
  return rs[0].id

def copyApplicationsByCallName(sourceName, targetName):
  src = getCallId(sourceName)
  target = getCallId(targetName)
  print 'Copying Applications from ' + src + ' to ' + target 
  copyApplicationsByCallId(src, target)
  
