// Social Harvest is a social media analytics platform.
//     Copyright (C) 2014 Tom Maiaroto, Shift8Creative, LLC (http://www.socialharvest.io)
//
//     This program is free software: you can redistribute it and/or modify
//     it under the terms of the GNU General Public License as published by
//     the Free Software Foundation, either version 3 of the License, or
//     (at your option) any later version.
//
//     This program is distributed in the hope that it will be useful,
//     but WITHOUT ANY WARRANTY; without even the implied warranty of
//     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//     GNU General Public License for more details.
//
//     You should have received a copy of the GNU General Public License
//     along with this program.  If not, see <http://www.gnu.org/licenses/>.

'use strict';

angular.module('socialHarvest', [
  'adf', 'socialHarvest.widgets.news',
  'socialHarvest.widgets.randommsg',
  'socialHarvest.widgets.weather',
  'socialHarvest.widgets.markdown',
  'socialHarvest.widgets.linklist',
  // 'socialHarvest.widgets.github',
  // 
  'LocalStorageModule', 'structures', 'socialHarvest.territory', 'ngRoute'
])
.config(function($routeProvider, localStorageServiceProvider){
  localStorageServiceProvider.setPrefix('adf');

  $routeProvider.when('/territory/dashboard', {
    templateUrl: 'templates/territory/dashboard.html',
    controller: 'territoryDashboardCtrl'
  })
  .when('/', {
    templateUrl: 'templates/home.html',
    controller: 'homeController'
  })
  .otherwise({
    redirectTo: '/'
  });

})
.controller('navigationCtrl', function($scope, $location){

  $scope.navCollapsed = true;

  $scope.toggleNav = function(){
    $scope.navCollapsed = !$scope.navCollapsed;
  };

  $scope.$on('$routeChangeStart', function() {
    $scope.navCollapsed = true;
  });

  $scope.navClass = function(page) {
    var currentRoute = $location.path().substring(1) || 'Sample 01';
    return page === currentRoute || new RegExp(page).test(currentRoute) ? 'active' : '';
  };

})
.controller('homeController', function($scope, $location){
  // The homeController is responsible for everything dealing with the landing page of Social Harvest.
  // It should include links to territories, overviews, and other various acitons.
  
  $scope.navClass = function(page) {
    var currentRoute = $location.path().substring(1) || 'Social Harvest';
    return page === currentRoute || new RegExp(page).test(currentRoute) ? 'active' : '';
  };
});
