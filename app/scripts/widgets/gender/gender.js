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

angular.module('socialHarvest.widgets.gender', ['adf.provider'])
  .config(function(dashboardProvider){
    dashboardProvider
      .widget('gender', {
        title: 'Gender',
        description: 'Gender breakdown of contributors in a territory',
        templateUrl: 'scripts/widgets/gender/gender.html',
        controller: 'GenderCtrl',
        reload: true,
        edit: {
          templateUrl: 'scripts/widgets/gender/edit.html'
        }
      });
  })
  .controller('GenderCtrl', function($scope, $rootScope, config, TerritoryAggregate){
    $scope.TerritoryGender = {
      "male": 0,
      "female": 0,
      "unknown": 0,
      "aggregateTotal": 1
    };

    $scope.aggregateGender = function(){
      TerritoryAggregate.get({territory: "javascript", series: "messages", fields: "contributor_gender", from: $rootScope.dateFrom, to: $rootScope.dateTo}, function(u, getResponseHeaders) {
        if(u._meta.success === true) {
          $scope.TerritoryGender.aggregateTotal = u._data.total;
          for(x in u._data.aggregate[0].counts.contributor_gender) {
            switch(u._data.aggregate[0].counts.contributor_gender[x].value) {
              case "0":
                $scope.TerritoryGender.unknown = u._data.aggregate[0].counts.contributor_gender[x].count;
                break;
              case "1":
                $scope.TerritoryGender.male = u._data.aggregate[0].counts.contributor_gender[x].count;
                break;
              case "-1":
                $scope.TerritoryGender.female = u._data.aggregate[0].counts.contributor_gender[x].count;
                break;
            }
          }
        }
      });
    };

    // Initial load.
    $scope.aggregateGender();

    // If the date range changes, re-load.
    $rootScope.$watch('dateTo', function(newVal, oldVal) {
      if(newVal !== oldVal) {
        $scope.aggregateGender();
      }
    });
    $rootScope.$watch('dateFrom', function(newVal, oldVal) {
      if(newVal !== oldVal) {
        $scope.aggregateGender();
      }
    });

  });