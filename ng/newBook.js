angular.module('app')
.controller('NewBook', function($scope, $location, LlibresService) {
    
    //Desenvolupem la funcio afegirLlibre
    $scope.afegirLlibre = function() {

        if (($scope.llibreTitol != undefined) & ($scope.llibreIsbn != undefined)) {

            LlibresService.create({
                "titol": $scope.llibreTitol,
                "isbn": $scope.llibreIsbn
            }).success(function(llibre) {
                
                $scope.llibreIsbn = null;
                $scope.llibreTitol = null;
                
            });
        }
        
        $location.path('/');
    };
    
    //Cancelem l'acció POST
    $scope.cancelarLlibre = function(llibre) {

        if (($scope.llibreTitol != undefined) & ($scope.llibreIsbn != undefined)) {
            
            $scope.llibreIsbn = null;
            $scope.llibreTitol = null; 
            
        }
    };
});