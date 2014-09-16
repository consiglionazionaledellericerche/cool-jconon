#!/usr/bin/python
# -*- coding: utf-8 -*-
"""move applications between different call folders"""

from cmis import REPO

#src = REPO.getObjectByPath("/Selezioni on-line/2013/7/BANDO 364.115/BANDO 364.115 SF")
src = REPO.getObject("workspace://SpacesStore/fd2845a0-f35e-4ada-aae0-be72752c0610")
print "source: " + src.name

#target = REPO.getObjectByPath("/Selezioni on-line/2013/7/BANDO 364.115/BANDO 364.115 SB")
target = REPO.getObject("workspace://SpacesStore/7fd99535-1950-4039-93f6-4f93f228454b")
print "target: " + target.name

applications = REPO.query("select cmis:objectId, cmis:name from jconon_application:folder where IN_FOLDER('%s')" % src.id)

print str(len(applications)) + " domande da copiare da " + src.name + " a " + target.name

for application in applications:
  print application.name
  REPO.getObject(application.id).move(src, target)


