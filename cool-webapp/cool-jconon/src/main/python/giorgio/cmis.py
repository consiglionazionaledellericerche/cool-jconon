#!/usr/bin/python
# -*- coding: utf-8 -*-
"""CMIS client boilerplate"""

from cmislib import CmisClient

class Connector:

	host = 'http://150.146.7.152:8180/alfresco'

	def __init__(self, host): 
		self.host = host

	def getRepo(self):
		USER = 'spaclient'
		PASSW = 'manijada!'

		REPO = CmisClient(self.host + '/cmisatom', USER, PASSW).defaultRepository

		INFO = REPO.getRepositoryInfo()
		print INFO.get('vendorName') + ' ' + INFO.get('productVersion')
		print USER + '@' + self.host
		return REPO