'use strict';

describe('Controller: MainCtrl', function () {

  // load the controller's module
  beforeEach(module('flowsApp'));

  var MainCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, $sessionStorage) {
    scope = $rootScope.$new();
    $sessionStorage.user = {'id': 'pippo'};
    MainCtrl = $controller('MainCtrl', {
      $scope: scope
    });
  }));

  it('should be main page in the scope', function () {
    expect(scope.page).toBe('main');
  });
});
