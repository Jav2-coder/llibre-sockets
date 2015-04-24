angular.module('app')
.controller('ListAutors', function($scope, $location, AutorService) {
    AutorService.fetch()
        .success(function(autors) {
            $scope.autors = autors;
        })
        .error(function(e) {
            console.log(e);
        });
        
          //Desenvolupem la funcio esborrar autors
    $scope.borrarAutor = function(autors) {
console.log(autors);
        AutorService.delete(autors._id)
            .success(function() {
                $scope.autors.splice($scope.autors.indexOf(autors), 1);
            });

    };
    // Traspassem informació a les variables del HTML
    $scope.editarAutor = function(autors) {

        AutorService.autorsEditar = autors;
        
        $location.path('/editAutor');
        
    };
});