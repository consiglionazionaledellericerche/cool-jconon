/*global cmisserver, paging, logger, search*/
var restrictions = cnrutils.getBean('repoUsageComponent').getRestrictions()
logger.info(restrictions);
restrictions.licenseExpiryDate;
