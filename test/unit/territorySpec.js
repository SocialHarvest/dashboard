describe('Social Harvest Territory', function() {

  beforeEach(module('socialHarvest'));

  it('should test the territory dashboard controller', inject(function($controller, $rootScope) {
    var ctrl = $controller('territoryDashboardCtrl', {
      $scope : $rootScope
    });
    expect($rootScope.name).toBe('territory-dashboard');
  }));


});
