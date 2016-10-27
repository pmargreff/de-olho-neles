var myApp = angular.module('serenata-de-amor-visualization', ['ui.router']);

myApp.config(function($stateProvider, $urlRouterProvider, $locationProvider) {
  
  $urlRouterProvider.otherwise("/");
  
  $locationProvider.html5Mode({
    enabled: false,
    requireBase: false,
    rewriteLinks: false
  });
  
  $stateProvider
    .state('view1', {
      url: "/",
      templateUrl: "partials/view1.html"
    })  
    .state('view2', {
      url: "/view2",
      templateUrl: "partials/view2.html"
    })  
    .state('view3', {
      url: "/view3",
      templateUrl: "partials/view3.html"
    })  
});
