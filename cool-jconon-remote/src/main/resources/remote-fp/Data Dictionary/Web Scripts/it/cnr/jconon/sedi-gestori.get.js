/*global people, url, args, groups, groupAuthority, model,cnrutils */
var user = people.getPerson(url.templateArgs.user),
  zone = args.zone,
  mygroups = people.getContainerGroups(user),
  result = {},
  i = 0,
  callType,
  sedi,
  myGroup;
while (i < mygroups.length) {
  myGroup = groups.getGroupForFullAuthorityName(mygroups[i].properties['cm:authorityName']);
  if (zone && groups.searchGroupsInZone(myGroup.getShortName(), zone).length > 0) {
    callType = mygroups[i].properties['jconon_group_gestori:call_type'];
    if (callType) {
      sedi = [];
      if (mygroups[i].properties['jconon_group_gestori:sede'] !== null) {
        sedi = mygroups[i].properties['jconon_group_gestori:sede'];
      }
      if (result[callType] !== undefined) {
        result[callType] = result[callType].concat(sedi);
      } else {
        result[callType] = sedi;
      }
    }
  }
  i = i + 1;
}
model.result = result;