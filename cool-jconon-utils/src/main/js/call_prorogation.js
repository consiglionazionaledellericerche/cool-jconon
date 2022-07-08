var pageSize = 100,
 currentPage = 0,
 currentPageSize = -1
 competitionQuery = {
    page : {
      maxItems: 1
    },
    language : 'cmis-strict',
    query : "select * from jconon_competition:folder"
  },
  competition = search.query(competitionQuery)[0],
  callsQuery = "select * from jconon_call:folder where IN_TREE('" + competition.nodeRef + "') and (jconon_call:data_inizio_invio_domande IS NULL or jconon_call:data_fine_invio_domande is null)",
  sort1 = { column: 'cm:modified', ascending: false },
  paging = { maxItems: pageSize, skipCount: 0 },
  def = { query: callsQuery, store: 'workspace://SpacesStore', language: 'cmis-alfresco', sort: [sort1], page: paging },
  i = 0;
while (currentPageSize != 0) {
  paging.skipCount = currentPage * pageSize; currentPage++;
  var calls = search.query(def);
  currentPageSize = (null != calls ? calls.length : 0);
  if (currentPageSize > 0) {
    calls.forEach(function(call) {
      i++;
      logger.info(call.name);
	  call.properties['jconon_call:data_inizio_invio_domande'] = call.properties['jconon_call:data_inizio_invio_domande_index'];
      call.properties['jconon_call:data_fine_invio_domande'] = call.properties['jconon_call:data_fine_invio_domande_index'];
      call.save();
    });
  }
}
logger.info(i);
