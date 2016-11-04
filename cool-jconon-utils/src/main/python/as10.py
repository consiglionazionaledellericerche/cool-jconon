#!/usr/bin/python

"""copia domande"""
import sys
import httppost
import smtplib
import json

args = sys.argv[1:]

def mail(dest, destName, bando):

  sender = 'concorsi@cnr.it'
  receivers = [dest]

  message = """From: Concorsi Online <concorsi@cnr.it>
To: To %s <%s>
Subject: Selezioni online Consiglio Nazionale delle Ricerche - Notifica copia domanda

Gentile %s

La informiamo che e' stata effettuata la copia della domanda di partecipazione nel %s
Per visualizzarla e completarla puo' accedere alla sezione "Le mie domande" attiva nella procedura Selezioni online
Cordiali Saluti
Per richieste di informazioni o assistenza, inviare una segnalazione utilizzando la sezione helpdesk del sito.
""" % (destName, dest, destName, bando)

  try:
     smtpObj = smtplib.SMTP('smtp.cnr.it')
     smtpObj.sendmail(sender, receivers, message)         
     print "Successfully sent email"
  except:
     print "Error: unable to send email"



for arg in args:
  a = arg.split('$')
  data = {
      "applicationSourceId": a[0],
      "callTargetId": a[1],
      "contributorToUser": True,
      "isAdmin": True
    }
  print data
  res = httppost.dopost(data)
  try:
    jsons = ' '.join(res.readlines())
    jsoncontent = json.loads(jsons)
    print jsoncontent
    if jsoncontent['esito'] == True:
      print "invio mail a " + jsoncontent['email']
      mail(jsoncontent['email'], jsoncontent['nominativo'], jsoncontent['bando'])
    else:
      print "esito negativo per la domanda di  " + jsoncontent['nominativo'] + ' bando: ' +  jsoncontent['bando']
  except:
    print "problemi " + arg
