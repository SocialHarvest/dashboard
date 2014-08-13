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

angular.module('territoryServices', ['ngResource'])
  .factory('TerritoryIndex', ['$resource', '$http', '$rootScope',
    function($resource, $http, $rootScope) {
      return $resource($rootScope.Config.apiHost + '/territory/list', {}, {
        get: {
          method: 'GET'
        }
      });
    }
  ])
  .factory('TerritoryAggregate', ['$resource', '$http', '$rootScope',
    function($resource, $http, $rootScope) {
      return $resource($rootScope.Config.apiHost + '/territory/aggregate/:territory/:series', {from: "@date", to: "@date", fields: "", network: ""}, {
        get: {
          method: 'GET'
        }
      });
    }
  ])
  .factory('TerritoryTimeseriesAggregate', ['$resource', '$http', '$rootScope', 
    function($resource, $http, $rootScope) {
      return {
        stream: function(options, startFn, nodeFn, doneFn) {
          oboe($rootScope.Config.apiHost + '/territory/timeseries/aggregate/' + options.territory + '/' + options.series + '?fields=' + options.fields + '&from=' + options.from + '&to=' + options.to + '&network=' + options.network + '&resolution=' + options.resolution)
           .start(startFn)
           .node(options.path, nodeFn)
           .done(doneFn);
        }
      };
    }
  ])
  .factory('TerritoryCount', ['$resource', '$http', '$rootScope',
    function($resource, $http, $rootScope) {
      return $resource($rootScope.Config.apiHost + '/territory/count/:territory/:series/:field', {from: "@date", to: "@date", fieldValue: "", network: ""}, {
        get: {
          method: 'GET'
        }
      });
    }
  ])
  .factory('TerritoryTimeseriesCount', ['$resource', '$http', '$rootScope', 
    function($resource, $http, $rootScope) {
      return {
        stream: function(options, startFn, nodeFn, doneFn) {
          oboe($rootScope.Config.apiHost + '/territory/timeseries/count/' + options.territory + '/' + options.series + '/' + options.field + '?from=' + options.from + '&to=' + options.to + '&network=' + options.network + '&resolution=' + options.resolution)
           .start(startFn)
           .node(options.path, nodeFn)
           .done(doneFn);
        }
      };
    }
  ]);