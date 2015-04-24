angular.module('app')
    .controller('EditBooks', function($scope, $location, LlibresService, AutorService) {
       
        AutorService.fetch()
        .success(function(autors) {
            $scope.autors = autors;
        });
       
            if (LlibresService.llibreEditar === null) {
                $location.path('/');
            } else {

            $scope.editarTitol = LlibresService.llibreEditar.titol;
            $scope.editarIsbn = LlibresService.llibreEditar.isbn;
            $scope.editarAutor = LlibresService.llibreEditar.autors;

            $scope.llibre_Editar = LlibresService.llibreEditar;
}

        //Cancelem l'acció PUT
        $scope.cancelarEdicio = function(llibre) {

            LlibresService.llibreEditar = null;
            
            $location.path('/');
        };

        // Traspassem informació a les variables del HTML
        $scope.actualitzarLlibre = function(llibre) {


            LlibresService.update($scope.llibre_Editar.isbn, {
                "titol": $scope.editarTitol,
                "isbn": $scope.editarIsbn,
                "autors": $scope.editarAutor
            })


            $location.path('/');

        };
    });