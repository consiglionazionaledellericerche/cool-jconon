#!/usr/bin/python

import Queue
import threading
import time
import giorgio
import sys

from cmis import Connector


if len(sys.argv) < 3:
    print "Usage: " + sys.argv[0] + ' [NDOCUMENTS] [NTHREADS]'
    sys.exit(0)

ndocuments = int(sys.argv[1])
nthreads = int(sys.argv[2])

dest = giorgio.setup()

exitFlag = 0

class myThread (threading.Thread):
    def __init__(self, threadID, name, q):
        threading.Thread.__init__(self)
        self.threadID = threadID
        self.name = name
        self.q = q
    def run(self):
        print "Starting " + self.name
        process_data(self.name, self.q)
        print "Exiting " + self.name

def process_data(threadName, q):
    while not exitFlag:
        queueLock.acquire()
        if not workQueue.empty():
            data = q.get()
            queueLock.release()
            print "%s processing %s" % (threadName, data)
            giorgio.addFile(dest, data)
        else:
            queueLock.release()
        time.sleep(1)

threadList = map(lambda x: 'Thread-' + str(x), range(nthreads))
queueLock = threading.Lock()
workQueue = Queue.Queue(10)
threads = []
threadID = 1

# Create new threads
for tName in threadList:
    thread = myThread(threadID, tName, workQueue)
    thread.start()
    threads.append(thread)
    threadID += 1

# Fill the queue
queueLock.acquire()
for x in range(ndocuments):
    workQueue.put(str(x))

queueLock.release()

# Wait for queue to empty
while not workQueue.empty():
    pass

# Notify threads it's time to exit
exitFlag = 1

# Wait for all threads to complete
for t in threads:
    t.join()

print "Exiting Main Thread"

# verifica risultati sui due nodi del cluster

time.sleep(20)

q = "select cmis:objectId from cmis:document where IN_FOLDER('%s')" % dest.id


REPO1 = Connector('http://as11.cedrc.cnr.it:8180/alfresco').getRepo()
rs1 = REPO1.query(q)

REPO2 = Connector('http://as11.cedrc.cnr.it:8180/alfresco').getRepo() #TODO: as12new
rs2 = REPO2.query(q)

if len(rs1) == len(rs2) and len(rs2) == ndocuments:
    print "ok"
else:
    print "errore: " +str(len(rs1)) + " " + str(len(rs2)) + " " + str(ndocuments)