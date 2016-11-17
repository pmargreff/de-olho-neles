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
      url: "/total",
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
      url: "/deputado",
      templateUrl: "partials/bycategory.html"
    })  
    .state('party', {
      url: "/partido",
      templateUrl: "partials/byparty.html"
    })  
    .state('about', {
      url: "/",
      templateUrl: "partials/about.html"
    })  
});
