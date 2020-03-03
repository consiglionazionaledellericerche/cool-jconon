/*global url, model, cnrutils */
var user = url.templateArgs.user,
  authenticationComponent = cnrutils.getBean("authenticationComponent"),
  authenticationService = cnrutils.getBean("authenticationService");
authenticationComponent
    .setCurrentAuthentication(authenticationComponent.setCurrentUser(user));
model.ticket = authenticationService.getCurrentTicket();