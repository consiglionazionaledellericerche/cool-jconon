var nomeCartellaStorico = "WFSTORICO";
var pathCartellaWorkflow = "//sys:system/sys:workflow";
var pathCartellaPadre = "PATH:\""+pathCartellaWorkflow+"/cm:"+nomeCartellaStorico+"\"";
var nodiCartellaPadre = search.luceneSearch(pathCartellaPadre);
var nodoCartellaPadre = nodiCartellaPadre[0];

var wf = {
    data: []
};

if(nodoCartellaPadre != null){
	logger.error("Elimino tutti gli elementi della CARTELLA "+nodoCartellaPadre.name); 
	rimuoviTuttiElementi(nodoCartellaPadre);
} 

function rimuoviTuttiElementi(nodoSelezionato){ 
if(nodoSelezionato != null){
    //logger.error("elementi trovati in "+nodoSelezionato.name);
        for each (var nodoTrovato in nodoSelezionato.children)
        {
          logger.error("Elimino elemento: "+nodoTrovato.name );
          nodoSelezionato.removeNode(nodoTrovato);
        }  
  } 
}

wf.data.push({ 
	"WFSTORICO" : nodoCartellaPadre.nodeRef		
});

model.data = wf;