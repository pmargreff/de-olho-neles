angular.module('serenata-de-amor-visualization').controller('CompanyController', function ($scope, $http) {
  $scope.updateheatmap = function(year) {    
    updateheatmap(year);    
  };
  
});

function updateheatmap(year) {
  alert(year)
}
