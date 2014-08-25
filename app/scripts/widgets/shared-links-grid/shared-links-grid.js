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

angular.module('socialHarvest.widgets.sharedLinksGrid', ['adf.provider', 'angular-md5'])
  .config(function(dashboardProvider){
    dashboardProvider
      .widget('shared-links-grid', {
        title: 'Shared Links Grid',
        description: 'Shows a grid of thumbnails for shared links or media',
        templateUrl: 'scripts/widgets/shared-links-grid/shared-links-grid.html',
        controller: 'SharedLinksCtrl',
        reload: true,
        edit: {
          templateUrl: 'scripts/widgets/shared-links-grid/edit.html'
        }
      });
  })
  .controller('SharedLinksCtrl', function($scope, $rootScope, config, md5, TerritoryAggregate){
    $scope.sortedLinks = [];
    $scope.sortedLinksTotal = 0;
    $scope.linkDetails = {};
    var updateLock = false;

    // TODO: config for the series. either shared_links or shared_media
    // config for limit too. by default do 25. who wants to scroll past a grid of 25 images? top10 might even be enough. maybe a list... maybe paginated... TODO: Paginated API method.
    // maybe an option to list a table list beneath the grid for other urls?
    $scope.aggregateSharedLinks = function(){
      updateLock = true;
      TerritoryAggregate.get({territory: $rootScope.territoryName, series: "shared_links", fields: "expanded_url", limit: 50, from: $rootScope.dateFrom, to: $rootScope.dateTo}, function(u, getResponseHeaders) {
        if(u._meta.success === true) {
          $scope.sortedLinksTotal = u._data.total;
          for(x in u._data.aggregate[0].counts.expanded_url) {
            $scope.linkDetails[md5.createHash(u._data.aggregate[0].counts.expanded_url[x].value)] = {};
            $scope.sortedLinks.push([u._data.aggregate[0].counts.expanded_url[x].value, u._data.aggregate[0].counts.expanded_url[x].count]);
          }
          $scope.sortedLinks.sort(function(a, b) {return b[1] - a[1]});
        }
        updateLock = false;
        console.dir($scope.sortedLinks);
      });
    };

    // Initial load.
    $scope.aggregateSharedLinks();

    // If the date range changes, re-load. Will $watchCollection work here? Not sure...I still think that fires twice because the values change one after the other.
    // So implementing a lock here too.
    $rootScope.$watch('dateTo', function(newVal, oldVal) {
      if(newVal !== oldVal) {
        if(!updateLock) {
          $scope.aggregateSharedLinks();
        }
      }
    });
    $rootScope.$watch('dateFrom', function(newVal, oldVal) {
      if(newVal !== oldVal) {
        if(!updateLock) {
          $scope.aggregateSharedLinks();
        }
      }
    });

  });