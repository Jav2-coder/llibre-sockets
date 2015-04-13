angular.module('app')
    .controller('EditBooks', function($scope, $location, LlibresService) {
        $scope.editarTitol = LlibresService.llibreEditar.titol;
        $scope.editarIsbn = LlibresService.llibreEditar.isbn;

        $scope.llibre_Editar = LlibresService.llibreEditar;

        //Cancelem l'acció PUT
        $scope.cancelarEdicio = function(llibre) {

            if (($scope.editarTitol != undefined) & ($scope.editarIsbn != undefined)) {

                $scope.editarIsbn = null;
                $scope.editarTitol = null;

            }
        };

        // Traspassem informació a les variables del HTML
        $scope.actualitzarLlibre = function(llibre) {


            if (($scope.editarTitol != undefined) & ($scope.editarIsbn != undefined)) {

                LlibresService.update($scope.llibre_Editar.isbn, {
                    "titol": $scope.editarTitol,
                    "isbn": $scope.editarIsbn
                })
            }
            $location.path('/');

        };
    });