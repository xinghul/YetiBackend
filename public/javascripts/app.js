var myApp;

(function () {
  "use strict";
  // Declare app level module which depends on filters, and services
  myApp = angular.module('myApp', [
    'ngRoute',
    'myApp.filters',
    'myApp.services',
    'myApp.directives',
    'ui.router'
  ])
  .config(function ($stateProvider, $urlRouterProvider){
        
    $urlRouterProvider.otherwise("/");
    
    $stateProvider
        .state('#', {
            url: "",
            views: {
                "viewA": {
                    template: "Here goes the introduction."
                },
                "viewB": {
                    template: "Here goes the pictures, etc."
                }
            }
        })
        .state('player', {
            url: '/player',
            views: {
              'viewC': {
                templateUrl: 'player',
                controller: 'PlayerCtrl'
              }
            }
        })
        .state('quest', {
            url: '/quest',
            views: {
                'viewC': {
                    templateUrl: "quest",
                    controller: "dBeaconCtrl"
                }
            }
        });
  });
}());





/*
.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
  $routeProvider
  .when('/beacons', {
    templateUrl: 'partials/beacons', 
    controller: 'BeaconListCtrl'
  })
  .when('/beacon/:id', {
    templateUrl: 'partials/beacon',
    controller: 'BeaconCtrl'
  })
  .when('/cypher', {
    templateUrl: 'partials/cypher',
    controller: 'CypherCtrl'
  })
  .when('/graph', {
    templateUrl: 'partials/graph',
    controller: 'GraphCtrl'
  })
  .when('/area', {
    templateUrl: 'types/area',
    controller: 'AreaCtrl'
  })
  .when('/region', {
    templateUrl: 'types/region',
    controller: 'RegionCtrl'
  })
  .when('/location', {
    templateUrl: 'types/location',
    controller: 'LocationCtrl'
  })
  .when('/position', {
    templateUrl: 'types/position',
    controller: 'PositionCtrl'
  })
  .when('/areatype', {
    templateUrl: 'types/areatype',
    controller: 'AreaTypeCtrl'
  })
  .when('/regiontype', {
    templateUrl: 'types/regiontype',
    controller: 'RegionTypeCtrl'
  })
  .when('/locationtype', {
    templateUrl: 'types/locationtype',
    controller: 'LocationTypeCtrl'
  })
  .when('/positiontype', {
    templateUrl: 'types/positiontype',
    controller: 'PositionTypeCtrl'
  })
  .when('/test', {
    templateUrl: 'test',
    controller: 'TestCtrl'
  })
  .otherwise({
    redirectTo: '/graph'
  });
  $locationProvider.html5Mode(true);
}]);
*/

