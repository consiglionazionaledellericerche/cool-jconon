#!/usr/bin/python

from cmis import Connector

temp = 'temp'
dd = '/Data Dictionary/'
name = 'Firefox.png'

def setup():
	REPO = Connector('http://150.146.7.152:8180/alfresco').getRepo()
	try:
	  item = REPO.getObjectByPath(dd + "" + temp)
	  print 'cancello ' + temp
	  item.deleteTree()
	except:
	  print 'non esite ' + temp

	print 'creo la cartella ' + temp

	return REPO.getObjectByPath(dd).createFolder(temp)


def addFile(dest, n):
  props = {}
  f = open(name, 'rb')
  print 'inserisco ' + name + ' (' + n + ')'
  dest.createDocument(n + '_' + name, props, contentFile=f)
  f.close();