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

var socialHarvestApp = angular.module('socialHarvest', [
  'ui.bootstrap', 
  //'ui.bootstrap.datepicker',
  'adf',
  // example widgets
  'socialHarvest.widgets.news',
  'socialHarvest.widgets.randommsg',
  'socialHarvest.widgets.weather',
  'socialHarvest.widgets.markdown',
  'socialHarvest.widgets.linklist',
  // 'socialHarvest.widgets.github',
  //
  'socialHarvest.widgets.gender',
  'socialHarvest.widgets.timeseriesLine',
  // 
  'angularMoment',
  'LocalStorageModule','structures',
  'territoryServices',
  'socialHarvest.territory',
  'ngRoute', 'ngResource'
])
.value('globals', {
  config : "social-harvest-dashboard-config.json"
})
.run(function($rootScope) {
  $rootScope.Config = {
    "apiHost": "http://localhost:2345"
  };
  if(window.SocialHarvestConfig !== undefined) {
    $rootScope.Config = window.SocialHarvestConfig;
  }
  // Default dates
  $rootScope.dateFrom = moment().subtract(29, 'days').format('YYYY-MM-DD');
  $rootScope.dateTo = moment().format('YYYY-MM-DD');
})
.config(function($routeProvider, localStorageServiceProvider){
  localStorageServiceProvider.setPrefix('adf');

  $routeProvider.when('/territory/dashboard/:territoryName', {
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
.controller('NavigationCtrl', function($scope, $rootScope, $location){

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

  // Date picker (watch dateFrom and dateTo locally, but send to $rootScope for everything else)
  $scope.dateFrom = $rootScope.dateFrom;
  $scope.dateTo = $rootScope.dateTo;
  $scope.$watch('dateFrom', function(newVal, oldVal) {
    if(newVal !== oldVal) {
      $rootScope.dateFrom = newVal;
    }
  });
  $scope.$watch('dateTo', function(newVal, oldVal) {
    if(newVal !== oldVal) {
      $rootScope.dateTo = newVal;
    }
  });


})
.controller('HomeController', function($scope, $location, TerritoryIndex){
  // The homeController is responsible for everything dealing with the landing page of Social Harvest.
  // It should include links to territories, overviews, and other various acitons.
  
  // Initial territory listing on page load
  TerritoryIndex.get({q: $scope.q}, function(u, getResponseHeaders) {
    if(u._meta.success === true) {
      $scope.territories = u._data.territories;
    }
  });

  $scope.navClass = function(page) {
    var currentRoute = $location.path().substring(1) || 'Social Harvest';
    return page === currentRoute || new RegExp(page).test(currentRoute) ? 'active' : '';
  };
});

// The date range picker is not in AngularJS (for now)
$(document).ready(function() {
  //$('input[name="daterange"]').daterangepicker({
  $('#social-harvest-date-range-picker').daterangepicker({
    ranges: {
     'Today': [new Date(), new Date()],
     'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
     'Last 7 Days': [moment().subtract(6, 'days'), new Date()],
     'Last 30 Days': [moment().subtract(29, 'days'), new Date()],
     'This Month': [moment().startOf('month'), moment().endOf('month')],
     'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
    },
    opens: 'left',
    format: 'YYYY-MM-DD',
    startDate: moment().subtract(29, 'days'),
    endDate: new Date()
  });

  $('#social-harvest-date-range-picker').on('apply.daterangepicker', function(ev, picker) {
    $('#social-harvest-date-range-from-input').val(picker.startDate.format('YYYY-MM-DD')).trigger('change');
    $('#social-harvest-date-range-to-input').val(picker.endDate.format('YYYY-MM-DD')).trigger('change');
  });

});