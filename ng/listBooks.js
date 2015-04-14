angular.module('app')
.controller('ListBooks', function($scope, $location, LlibresService) {
    LlibresService.fetch()
        .success(function(llibres) {
            $scope.llibres = llibres;
        })
        .error(function(e) {
            console.log(e);
        });
        
          //Desenvolupem la funcio esborrar llibre
    $scope.borrarLlibre = function(llibre) {

        LlibresService.delete(llibre.isbn)
            .success(function() {
                $scope.llibres.splice($scope.llibres.indexOf(llibre), 1);
            });

    };
    // Traspassem informació a les variables del HTML
    $scope.editarLlibre = function(llibre) {

        LlibresService.llibreEditar = llibre;
        
        $location.path('/editarLlibre');
        
    };
});