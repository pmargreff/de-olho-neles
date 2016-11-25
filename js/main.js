var myApp = angular.module('serenata-de-amor-visualization', ['ui.router']);

myApp.config(function($stateProvider, $urlRouterProvider, $locationProvider) {
  
  $urlRouterProvider.otherwise("/");
  
  $locationProvider.html5Mode({
    enabled: false,
    requireBase: false,
    rewriteLinks: false
  });
  
  $stateProvider
    .state('total', {
      url: "/",
      templateUrl: "partials/total.html"
    })  
    .state('bystate', {
      url: "/estados",
      templateUrl: "partials/bystate.html"
    })  
    .state('bycompany', {
      url: "/empresas",
      templateUrl: "partials/bycompany.html"
    })  
    .state('bycategory', {
      url: "/categoria",
      templateUrl: "partials/bycategory.html"
    })  
    .state('party', {
      url: "/party",
      templateUrl: "partials/byparty.html"
    })  
    .state('about', {
      url: "/about",
      templateUrl: "partials/about.html"
    })  
    .state('home', {
      url: "/home",
      templateUrl: "partials/home.html"
    })  
});
