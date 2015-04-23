#!/usr/bin/python
import sys
import httppost
import smtplib
import json
import conteggio

def mail(dest, text):

  sender = 'francesco.uliana@cnr.it'
  receivers = [dest]

  message = """From: Francesco Uliana <francesco.uliana@cnr.it>
To: %s <%s>
Subject: Conteggio mail

%s
""" % (dest, dest, text)

  try:
     smtpObj = smtplib.SMTP('smtp.cnr.it')
     smtpObj.sendmail(sender, receivers, message)         
     print "Successfully sent email"
  except:
     print "Error: unable to send email"



mail('francesco.uliana@cnr.it', conteggio.count())
