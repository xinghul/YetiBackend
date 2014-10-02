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
        .state('index', {
            url: "/",
            views: {
                "viewA": {
                    template: "Team Y.E.T.I. (Youth Education Tundra Initiative) seeks to create an educational game that will transport its players to the arctic tundra. We are working with Mountainview Elementary to give its students an immersive experience that will make them feel as if they are encountering the biome firsthand and familiarize them with the area’s ecosystem. Our game will be developed with tools at the forefront of technology used in the classroom. Our goal is to give our players a feeling of discovery and a sense of the types of life forms that inhabit this unique biome. We want our game not only to excite the players but also encourage them to explore and find out more about this amazing habitat. Project Instructors: Mike Christel and Jess Trybus"
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
        .state('animal', {
            url: '/animal',
            views: {
              'viewC': {
                templateUrl: 'animal',
                controller: 'AnimalCtrl'
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

