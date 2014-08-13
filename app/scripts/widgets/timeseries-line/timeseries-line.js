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

angular.module('socialHarvest.widgets.timeseriesLine', ['adf.provider', 'nvd3ChartDirectives'])
  .config(function(dashboardProvider){
    dashboardProvider
      .widget('timeseries-line', {
        title: 'Line Chart (time series)',
        description: 'A line chart for aggregate field values in a series',
        templateUrl: 'scripts/widgets/timeseries-line/line.html',
        controller: 'TimeSeriesLineCtrl',
        reload: true,
        edit: {
          templateUrl: 'scripts/widgets/timeseries-line/edit.html'
        }
      });
  })
  .controller('TimeSeriesLineCtrl', function($scope, $rootScope, config, TerritoryTimeseriesCount){
    
    $scope.graphData = [];
    var series = {
      "key": "Mentions",
      "values": []
    };

    // Automatically choose the resolution based on date range. Don't let this be configured because it could get confusing.
    // When the time slices are too small, say every 5 minutes for a date range of a week...Visually things don't fit first off.
    // Second, it creates a visual problem as the data loads in (because it takes a while to load and the way NVD3 is setup with the directives).
    // TODO: Look into how to smooth out that animation and then maybe allow this setting to be changed...But that still doesn't help people out
    // when there's too many x-axis items to be able to tell them apart. Maybe another animated graph widget would be better that scrolls a graph
    // with only part of it in view at a time.
    // 
    // In minutes, so this is one day (default resolution).
    $scope.autoResolution = 1440;

    $scope.setAutoResolution = function() {
      var fromMoment = moment($rootScope.dateFrom);
      var toMoment = moment($rootScope.dateTo);
      var daysDiff = toMoment.diff(fromMoment, 'days');

      // Every hour if only displaying a single day.
      if(daysDiff == 1) {
        $scope.autoResolution = 60;
      }
      // Every week if displaying more than a month
      if(daysDiff > 31) {
        $scope.autoResolution = 10080;
      }
      // Every month if displaying a year or more
      if(daysDiff >= 365) {
        $scope.autoResolution = 43829;
      }
    };


    $scope.aggregateTimeseries = function(){
      TerritoryTimeseriesCount.stream({
        territory: "javascript",
        series: "messages",
        field: "*",
        fieldValue: "",
        network: "",
        resolution: $scope.autoResolution,
        from: $rootScope.dateFrom,
        to: $rootScope.dateTo,
        path: '{count timeFrom}'
      },
      // start
      function(status, headers){
        // console.dir(headers);
        // this.abort(); // could be called from here too
      },
      // node
      function(data){
        if(data !== null) {
          var count = (data.count !== undefined) ? data.count:0;
          series.values.push([moment(data.timeFrom).unix(), count]);
        }
        
        // Just keep updating it as more data comes in
        $scope.$apply(function() {
          $scope.graphData = [series];
        });
       
      },
      // done
      function(parsedJson){
        /*$scope.$apply(function() {
          $scope.graphData = [series];
        });*/
      });
    };

    $scope.xAxisTickFormatFunction = function(){
        return function(d){
            //return d3.time.format('%H:%M')(moment.unix(d).toDate());
            return moment.unix(d).format('M/DD');
        };
    };

    // Initial load.
    $scope.aggregateTimeseries();

    // If the date range changes, re-load.
    $rootScope.$watch('dateTo', function(newVal, oldVal) {
      if(newVal !== oldVal) {
        $scope.setAutoResolution();

        $scope.graphData = [];
        series = {
          "key": "Mentions",
          "values": []
        };
        $scope.aggregateTimeseries();
      }
    });
    $rootScope.$watch('dateFrom', function(newVal, oldVal) {
      if(newVal !== oldVal) {
        $scope.setAutoResolution();

        $scope.graphData = [];
        series = {
          "key": "Mentions",
          "values": []
        };
        $scope.aggregateTimeseries();
      }
    });

  });