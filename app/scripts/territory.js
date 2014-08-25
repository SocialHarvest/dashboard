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

angular.module('socialHarvest.territory', ['adf', 'LocalStorageModule'])
.controller('territoryDashboardCtrl', function($scope, $location, $route, $rootScope, localStorageService){
  if($route.current.params.territoryName === undefined || $route.current.params.territoryName === "") {
    $location.path("/");
  }
  $rootScope.territoryName = $route.current.params.territoryName;

  var name = 'territory-dashboard';
  var model = localStorageService.get(name);
  if (!model) {
    // set default model for demo purposes
    model = {
      title: "Territory Overview",
      structure: "4-8",
      rows: [{
        columns: [{
          styleClass: "col-md-4",
          widgets: [{
            type: "linklist",
            config: {
              links: [{
                title: "SCM-Manager",
                href: "http://www.scm-manager.org"
              }, {
                title: "Github",
                href: "https://github.com"
              }, {
                title: "Bitbucket",
                href: "https://bitbucket.org"
              }, {
                title: "Stackoverflow",
                href: "http://stackoverflow.com"
              }]
            },
            title: "Links"
          }, {
            type: "weather",
            config: {
              location: "Hildesheim"
            },
            title: "Weather Hildesheim",
            icon: "fa fa-cloud"
          }, {
            type: "weather",
            config: {
              location: "Edinburgh"
            },
            title: "Weather"
          }, {
            type: "weather",
            config: {
              location: "Dublin,IE"
            },
            title: "Weather"
          }]
      }, {
          styleClass: "col-md-8",
          widgets: [{
            type: "messages",
            config: {
                collapsible: true,
                maximizable: true,
                panelColorClass: {
                    heading: "blue-bg white"
                }
            },
            title: "Douglas Adams",
            icon: "fa fa-quote-left"
        }, {
            type: "markdown",
            config: {
              collapsible: true,
              content: "![scm-manager logo](https://bitbucket.org/sdorra/scm-manager/wiki/resources/scm-manager_logo.jpg)\n\nThe easiest way to share and manage your Git, Mercurial and Subversion repositories over http.\n\n* Very easy installation\n* No need to hack configuration files, SCM-Manager is completely configureable from its Web-Interface\n* No Apache and no database installation is required\n* Central user, group and permission management\n* Out of the box support for Git, Mercurial and Subversion\n* Full RESTFul Web Service API (JSON and XML)\n* Rich User Interface\n* Simple Plugin API\n* Useful plugins available ( f.e. Ldap-, ActiveDirectory-, PAM-Authentication)\n* Licensed under the BSD-License"
            },
            title: "Markdown"
        }]
      }]
      }]
    };
  }
  $scope.name = name;
  $scope.model = model;
  $scope.collapsible = false;


  $scope.$on('adfDashboardChanged', function (event, name, model) {
    localStorageService.set(name, model);
  });
});
