angular.module('app')
.controller('NewAutor', function($scope, $location, AutorService) {
    
    //Desenvolupem la funcio afegirAutor
    $scope.afegirAutor = function() {

        if (($scope.autorNom != undefined) & ($scope.autorCognom != undefined)) {

           AutorService.create({
                "nom": $scope.autorNom,
                "cognoms": $scope.autorCognom
            }).success(function(autors) {
                
                $scope.autorNom = null;
                $scope.autorCognom = null;
                
            });
        }
        
        $location.path('/llistaAutors');
    };
    
    //Cancelem l'acció POST
    $scope.cancelarAutor = function(autors) {

       $location.path('/llistaAutors');
    };
});