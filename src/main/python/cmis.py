#!/usr/bin/python
# -*- coding: utf-8 -*-
"""CMIS client boilerplate"""

import completion # pylint: disable=W0611
from cmislib import CmisClient
#import cmislib
from termcolor import colored
from pprint import pprint

AS9 = 'http://as9.cedrc.cnr.it:8080/alfresco'
AS11 = 'http://as11.cedrc.cnr.it:8180/alfresco'
AS12 = 'http://as12.cedrc.cnr.it:8080/alfresco'
GESTDOC = 'https://gestdoc.cnr.it/alfresco'
AS7PREPROD = 'http://as7preprod.cedrc.cnr.it:8080/alfresco'
AS8PREPROD = 'http://as8preprod.cedrc.cnr.it:8080/alfresco'
TEST7 = 'http://test7.si.cnr.it/alfresco'
LOCALHOST = 'http://fuliana.si.cnr.it:8181/alfresco-app-doccnr'

USER = 'spaclient'
#PASSW = 'manijada!'
PASSW = 'sp@si@n0'

HOST = TEST7
#HOST = AS11

if HOST == GESTDOC:
  print colored('PRODUZIONE !!!', 'red')

REPO = CmisClient(HOST + '/cmisatom', USER, PASSW).defaultRepository

INFO = REPO.getRepositoryInfo()
print INFO.get('vendorName') + ' ' + INFO.get('productVersion')
print USER + '@' + HOST

def print_title(folder):
    """print title"""
    print folder.getTitle()

def sons(parent, callback=print_title, height=0):
    """apply parameter callback to each parent's son"""
    prefix = ''
    for _ in range(height + 1):
        prefix += '-'
    for doc in parent.getChildren():
        if doc.getProperties().get("cmis:baseTypeId") == 'cmis:document':
            print colored(prefix + ' ' + doc.getName(), 'blue')

    for folder in parent.getTree(depth='1'):
        print colored(prefix + ' ' + folder.getTitle(), 'green')
        callback(folder, callback, height + 1)

def tree(folder):
    """CMIS tree function"""
    for path in folder.getPaths():
        print path
    sons(folder, sons)

def stampa(docs):
  for doc in docs:
    d = REPO.getObject(doc)
    p = d.getPaths()[0]
    stato = d.getObjectParents()[0].getProperties().get("jconon_application:stato_domanda")
    if stato is None:
      print '?' + ',' + p
    else:
      print str(stato) + ',' + p

def domanda(username):
   return REPO.query("select * from jconon_application:folder where contains('cmis:name:%s')" % username)

def domande(username):
  rs = domanda(username)
  return map(lambda doc : doc.getPaths()[0] + ' ' + doc.properties['jconon_application:stato_domanda'], rs)

def exploreByPath(path):
  f = REPO.getObjectByPath(path)
  return explore(f.id)

def explore(nodeRef):
  f = REPO.getObject(nodeRef);
  children = f.getChildren()
  if (len(children) == 0):
    print f.name
  else:
    explore(f)
  print map(lambda x: x.properties['cmis:name'], children)
