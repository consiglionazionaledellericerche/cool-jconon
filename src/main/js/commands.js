/*global cmisserver, paging, logger, search*/

var bando = 'workspace://SpacesStore/1bf23cce-eb13-48a4-9378-ebba17245389';

var query = "select cmis:objectId, jconon_application:user from jconon_application:folder where IN_TREE('" + bando + "')";
var rs = cmisserver.query(query, paging.createPageOrWindow(null, null, null, null)).result;

var i, r, user, id, n;
for (i = 0; i < rs.length(); i++) {
  r = rs.getRow(i);
  user = r.getValue('jconon_application:user');
  id = r.getValue('cmis:objectId');
  logger.info(user + ' ' + id);
  n = search.findNode(id);
  n.setPermission('Contributor', user);
//  n.removePermission('Contributor', user);
  logger.info(n.permissions);
}
