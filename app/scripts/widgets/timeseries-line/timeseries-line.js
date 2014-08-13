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

    // Listen for either date from or date to change in the date range...But don't open two streams.
    // Not only does it keep another connection open on the server (and if we don't close any, it ends up slowing down the browser),
    // but it also messes with the line chart. Visual glitches when trying to graph a series that isn't quite right.
    $scope.currentStream = {abort:function(){}};
    var updateLock = false;

    $scope.countTimeseries = function(resolution){
      // Kill whatever other connection was going on and set the lock.
      $scope.currentStream.abort();
      updateLock = true;

      // Reset data.
      $scope.graphData = [];
      series = {
        "key": "Mentions",
        "values": []
      };

      TerritoryTimeseriesCount.stream({
        territory: "javascript",
        series: "messages",
        field: "*",
        fieldValue: "",
        network: "",
        resolution: 1440,
        from: $rootScope.dateFrom,
        to: $rootScope.dateTo,
        path: '{count timeFrom}'
      },
      // start
      function(status, headers){
        // As soon as we have a response from the server, we can remove the lock.
        // When both date values update and call `countTimeseries` at the same(ish) time, it opens two connections...
        // But the $watch is fast enough that both will fire before a connection to the server can be made (even locally).
        // TODO: This seems to limit things, but look into a better solution.
        // Maybe have another variable in $rootScope update that says the entire date range has updated...Which would mean it would have to timeout.
        // Because each date can be adjusted separately so one may not change. If it were to, it would certainly change within a second or two.
        // ...which is kind of the idea behind the lock being here...But I imagine other widgets will run into this issue and have this need too.
        updateLock = false;
        // console.dir(headers);
        // this.abort(); // could be called from here too
      },
      // node
      function(data){
      },
      // done
      function(data){
        $scope.currentStream = this;

        if(data !== null) {
          var count = (data.count !== undefined) ? data.count:0;
          series.values.push([moment(data.timeFrom).unix(), count]);
        }
        
        // Just keep updating it as more data comes in
        $scope.$apply(function() {
          $scope.graphData = [series];
        });

        // Abort and close the connection once we've reached results for the end of the current date range.
        // This may never happen depending on the circumstances...But it's nice to get back resources if we know we're done.
        if(moment(data.timeTo).unix() >= moment($rootScope.dateTo).unix()) {
          this.abort();
        }
      });
    };

    $scope.xAxisTickFormatFunction = function(){
        return function(d){
            //return d3.time.format('%H:%M')(moment.unix(d).toDate());
            return moment.unix(d).format('M/DD');
        };
    };

    // Initial load.
    $scope.countTimeseries();


    // If the date range changes, re-load.
    $rootScope.$watch('dateTo', function(newVal, oldVal) {
      if(newVal !== oldVal) {
        if(!updateLock) {
          $scope.countTimeseries();
        }
      }
    });
    $rootScope.$watch('dateFrom', function(newVal, oldVal) {
      if(newVal !== oldVal) {
        if(!updateLock) {
          $scope.countTimeseries();
        }
      }
    });

  });