angular.module('app')
.controller('NewBook', function($scope, $location, LlibresService, AutorService) {

    AutorService.fetch()
        .success(function(autors) {
            $scope.autors = autors;
        });
    
    //Desenvolupem la funcio afegirLlibre
    $scope.afegirLlibre = function() {

        if (($scope.llibreTitol != undefined) & ($scope.llibreIsbn != undefined)) {

            LlibresService.create({
                "titol": $scope.llibreTitol,
                "isbn": $scope.llibreIsbn,
                "autors" : $scope.llibreAutor
            }).success(function(llibre) {
                
                $scope.llibreIsbn = null;
                $scope.llibreTitol = null;
                $scope.llibreAutor = null;
                
            });
        }
        
        $location.path('/');
    };
    
    //Cancelem l'acció POST
    $scope.cancelarLlibre = function(llibre) {

       $location.path('/');
    };
});