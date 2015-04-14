angular.module('app')
    .controller('EditBooks', function($scope, $location, LlibresService) {
       
            if (LlibresService.llibreEditar === null) {
                $location.path('/');
            }

            $scope.editarTitol = LlibresService.llibreEditar.titol;
            $scope.editarIsbn = LlibresService.llibreEditar.isbn;

            $scope.llibre_Editar = LlibresService.llibreEditar;


        //Cancelem l'acció PUT
        $scope.cancelarEdicio = function(llibre) {

            $location.path('/');
        };

        // Traspassem informació a les variables del HTML
        $scope.actualitzarLlibre = function(llibre) {


            LlibresService.update($scope.llibre_Editar.isbn, {
                "titol": $scope.editarTitol,
                "isbn": $scope.editarIsbn
            })


            $location.path('/');

        };
    });