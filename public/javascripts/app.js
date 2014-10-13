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
        .state("about", {
            url: "/",
            templateUrl: "about"
        })
        .state('player', {
            url: '/player',
            templateUrl: 'player',
            controller: 'PlayerCtrl'
        })
        .state('animal', {
            url: '/animal',
            templateUrl: 'animal',
            controller: 'AnimalCtrl'
        })
        .state('quest', {
            url: '/quest',
            templateUrl: "quest",
            controller: "dBeaconCtrl"
        })
        .state("login", {
            url: "/login",
            templateUrl: "login",
            controller: "LoginCtrl"
        })
        .state("signup", {
            url: "/signup",
            templateUrl: "signup",
            controller: "SignupCtrl"
        })
        .state("profile", {
            url: "/profile",
            templateUrl: "profile",
            controller: "ProfileCtrl"
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

