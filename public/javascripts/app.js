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
        .state("game", {
            url: "/game",
            templateUrl: "game"
        })
        .state("log", {
            url: "/log",
            templateUrl: "log",
            controller: "LogCtrl"
        })
            .state("log.mission", {
                url: "/mission",
                templateUrl: "log/mission",
                controller: "LogMissionCtrl"
            })
            .state("log.clue", {
                url: "/clue",
                templateUrl: "log/clue",
                controller: "LogClueCtrl"
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


