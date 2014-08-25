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

angular.module('socialHarvest.widgets.messages', ['adf.provider', 'ngTable'])
  .config(function(dashboardProvider){
    dashboardProvider
      .widget('messages', {
        title: 'Messages',
        description: 'A table listing of messages with pagination',
        templateUrl: 'scripts/widgets/messages/messages.html',
        controller: 'MessagesCtrl',
        reload: true,
        edit: {
          templateUrl: 'scripts/widgets/messages/edit.html'
        }
      });
  })
  .controller('MessagesCtrl', function($scope, $rootScope, $timeout, config, ngTableParams, TerritoryMessages){
    $scope.messages = [];
    $scope.messagesTotal = 0;
    var updateLock = false;

    $scope.questions = "";
    if(config.questions === undefined) {
      $scope.questions = "";
    }
    if(config.questions === true) {
      $scope.questions = "1";
    }

    $scope.messageSearch = "";
    $scope.tableParams = new ngTableParams({
      from: $rootScope.dateFrom,
      to: $rootScope.dateTo,
      questions: $scope.questions,
      search: $scope.messageSearch,
      page: 1, // show first page
      count: 10 // count per page
    }, {
      total: 0,
      getData: function($defer, params) {
        console.dir(params)
          TerritoryMessages.get({territory: $rootScope.territoryName, limit: params.$params.count, skip: ((params.$params.page - 1) * params.$params.count), search: params.$params.search, questions: params.$params.questions, from: params.$params.dateFrom, to: params.$params.dateTo}, function(u, getResponseHeaders) {
            if(u._meta.success === true) {
              $scope.messagesTotal = u._data.total;
              $scope.messages = u._data.messages;

              params.total(u._data.total);
              $defer.resolve(u._data.messages);

            }
            console.dir($scope.messages);
          });
      }
    });
    
    // Watch $scope.messageSearch and if the text entered by the user was more than three characters, update the search parameter.
    var tempFilterText = '',
        filterTextTimeout;
    $scope.$watch('messageSearch', function(newVal, oldVal) {
      if(newVal !== oldVal) {
          if (filterTextTimeout) $timeout.cancel(filterTextTimeout);

          tempFilterText = newVal;
          filterTextTimeout = $timeout(function() {
              $scope.filterText = tempFilterText;
              $scope.tableParams.$params.search = newVal;
          }, 500); // delay 500 ms
      }
    });

    // If the date range changes, re-load. Will $watchCollection work here? Not sure...I still think that fires twice because the values change one after the other.
    // So implementing a lock here too.
    $rootScope.$watch('dateTo', function(newVal, oldVal) {
      if(newVal !== oldVal) {
        if(!updateLock) {
          $scope.getMessages();
        }
      }
    });
    $rootScope.$watch('dateFrom', function(newVal, oldVal) {
      if(newVal !== oldVal) {
        if(!updateLock) {
          $scope.getMessages();
        }
      }
    });

  });