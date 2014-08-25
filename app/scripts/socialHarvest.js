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
  'socialHarvest.widgets.messages',
  'socialHarvest.widgets.gender',
  'socialHarvest.widgets.timeseriesLine',
  'socialHarvest.widgets.sharedLinksGrid',
  //
  'angular-md5',
  'angularMoment',
  'LocalStorageModule','structures',
  'territoryServices',
  'utilityServices',
  'socialHarvest.territory',
  'ngTable',
  'ngRoute', 'ngResource',
  'exceptionOverride'
])
.value('globals', {
  config : "social-harvest-dashboard-config.json"
})
.run(function($rootScope) {
  // TODO: Load bugsnag from config. apply apiKey to Bugsnag.apiKey I believe it is... then follow instructions and make a service too that can be injected for manual calls that goes no where if no key.
  $rootScope.Config = {
    "apiHost": "http://localhost:2345",
    "bugsnagApiKey": false
  };
  if(window.SocialHarvestConfig !== undefined) {
    $rootScope.Config = window.SocialHarvestConfig;
  }
  // Default dates
  $rootScope.dateFrom = moment().subtract(29, 'days').format('YYYY-MM-DD');
  $rootScope.dateTo = moment().format('YYYY-MM-DD');
  //
  // temp
  $rootScope.territoryName = "";
})
.config(function($routeProvider, localStorageServiceProvider){
  localStorageServiceProvider.setPrefix('adf');

  $routeProvider.when('/territory/dashboard/:territoryName', {
    templateUrl: 'templates/territory/dashboard.html',
    controller: 'territoryDashboardCtrl'
  })
  .when('/', {
    templateUrl: 'templates/home.html'
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
})
.filter('truncate', function () {
    /**
     * Truncate Filter
     * @Param text
     * @Param length, default is 10
     * @Param end, default is "..."
     * @return string
    */
    return function (text, length, end) {
        if (isNaN(length))
            length = 10;

        if (end === undefined)
            end = "...";

        if (text.length <= length || text.length - end.length <= length) {
            return text;
        }
        else {
            return String(text).substring(0, length-end.length) + end;
        }

    };
})
.filter('urlsAndTags', function() {
    var urls = /(\b(https?|ftp):\/\/[A-Z0-9+&@#\/%?=~_|!:,.;-]*[-A-Z0-9+&@#\/%=~_|])/gim;
    var emails = /(\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,6})/gim;
    var hashTags = /\#([A-Z0-9\_\-]+)/gim;
    var userHandle = /\@([A-Z0-9\_]{1,15})/gim;

    return function(text, network) {
        if(text.match(urls)) {
            text = text.replace(urls, "<a href=\"$1\" target=\"_blank\">$1</a>");
        }
        if(text.match(emails)) {
            text = text.replace(emails, "<a href=\"mailto:$1\">$1</a>");
        }
        if(text.match(hashTags)) {
            text = text.replace(hashTags, "<a href=\"https://twitter.com/search?q=%23$1\" target=\"_blank\">#$1</a>");
        }
        if(text.match(userHandle)) {
          
          if(network !== undefined) {
            switch(network) {
              case "twitter":
                text = text.replace(userHandle, "<a href=\"https://twitter.com/$1\" target=\"_blank\">@$1</a>");
                break;
              case "vine":
                break;
              default:
                break;
            }
          }
        }

        return text       
    };
});

// Bugsnag, if configured (and if the Bugsnag notifier has been included on the page).
angular.module('exceptionOverride', []).factory('$exceptionHandler', ['$log', '$window', function ($log, $window) {
  return function (exception, cause) {
    // Still log to console.
    $log.error.apply($log);
    // Also to Bugsnag if, in the least, the API key is set in config.js.
    if(Bugsnag !== undefined && $window.SocialHarvestConfig !== undefined && $window.SocialHarvestConfig.bugsnag !== undefined) {
      Bugsnag.apiKey = $window.SocialHarvestConfig.bugsnag.apiKey;
      if($window.SocialHarvestConfig.bugsnag.appVersion !== undefined) {
        Bugsnag.appVersion = $window.SocialHarvestConfig.bugsnag.appVersion;
      }
      if($window.SocialHarvestConfig.bugsnag.metaData !== undefined) {
        Bugsnag.metaData = $window.SocialHarvestConfig.bugsnag.metaData;
      }
      if($window.SocialHarvestConfig.bugsnag.releaseStage !== undefined) {
        Bugsnag.releaseStage = $window.SocialHarvestConfig.bugsnag.releaseStage;
      }
      if($window.SocialHarvestConfig.bugsnag.autoNotify !== undefined) {
        Bugsnag.autoNotify = $window.SocialHarvestConfig.bugsnag.autoNotify;
      }
      if($window.SocialHarvestConfig.bugsnag.projectRoot !== undefined) {
        Bugsnag.projectRoot = $window.SocialHarvestConfig.bugsnag.projectRoot;
      }
      if (angular.isString(exception)) {
        Bugsnag.notify(exception);
      } else {
        Bugsnag.notifyException(exception, {diagnostics:{cause: cause}});
      }
    }
  }($window);
}]).run(['$location', function($location) {
  // Make sure Bugsnag knows about the location as it pertains to AngularJS.
  if(Bugsnag !== undefined) {
    Bugsnag.context = $location.url();
  }
}]);

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