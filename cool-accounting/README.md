=== Project info ===

SVN repository URL:
svn+ssh://scm.cedrc.cnr.it/data/svnroot/svn-alfrescoportal/trunk/cool/cool-accounting

Progetto per gestire le contabili della BNL
Di seguito alcuni script di utilità da eseguire sulla console.

var contabiliGroup = people.createGroup("CONTABILI_BNL");
people.createGroup(contabiliGroup, "CONTABILI_BNL_COORDINATOR");
people.createGroup(contabiliGroup, "CONTABILI_BNL_CONTRIBUTOR");
people.createGroup(contabiliGroup, "CONTABILI_BNL_CONSUMER");

groups.getGroup("CONTABILI_BNL_COORDINATOR").addAuthority("domenica.cava");
groups.getGroup("CONTABILI_BNL_CONTRIBUTOR").addAuthority("bnlmail");
groups.getGroup("CONTABILI_BNL_CONSUMER").addAuthority("stanislao.fusco");
groups.getGroup("CONTABILI_BNL_CONSUMER").addAuthority("saverio.salvatore");
groups.getGroup("CONTABILI_BNL_CONSUMER").addAuthority("daniela.castellet");
groups.getGroup("CONTABILI_BNL_CONSUMER").addAuthority("gianpietro.angelini");

var contabili = companyhome.childByNamePath("Comunicazioni al CNR/Contabili");
contabili.setPermission("Consumer", "GROUP_CONTABILI_BNL");
var figli = contabili.children; 
for (i in figli){
    figli[i].setInheritsPermissions(false);
    figli[i].setPermission("Consumer", "GROUP_CONTABILI_BNL_CONSUMER");
    figli[i].setPermission("Coordinator", "GROUP_CONTABILI_BNL_COORDINATOR");
    figli[i].setPermission("Contributor", "GROUP_CONTABILI_BNL_CONTRIBUTOR");
} 

=== Script per la creazione di una nuova folder ===
var contabili = companyhome.childByNamePath("Comunicazioni al CNR/Contabili");
var newFolder = contabili.createFolder("084 - SISTEMI AGRICOLI E FORESTALI DEL MEDITERRANEO");
newFolder.addAspect("sigla_contabili_aspect:folder");
var props = new Array(1);
props["emailserver:aliasable"] = "contabili.084";
newFolder.addAspect("emailserver:aliasable", props);

newFolder.setInheritsPermissions(false);
newFolder.setPermission("Consumer", "GROUP_CONTABILI_BNL_CONSUMER");
newFolder.setPermission("Coordinator", "GROUP_CONTABILI_BNL_COORDINATOR");
newFolder.setPermission("Contributor", "GROUP_CONTABILI_BNL_CONTRIBUTOR");

=== Quick Run ===
