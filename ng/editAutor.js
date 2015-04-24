angular.module('app')
    .controller('EditAutor', function($scope, $location, AutorService) {
       
            if (AutorService.autorsEditar === null) {
                $location.path('/llistaAutors');
            } else {

            $scope.editarNom = AutorService.autorsEditar.nom;
            $scope.editarCognom = AutorService.autorsEditar.cognoms;

            $scope.autor_Editar = AutorService.autorsEditar;
}

        //Cancelem l'acció PUT
        $scope.cancelarAutor = function(autors) {

            AutorService.autorsEditar = null;
            
            $location.path('/llistaAutors');
        };

        // Traspassem informació a les variables del HTML
        $scope.actualitzarAutor = function(autors) {


            AutorService.update($scope.autor_Editar._id, {
                "nom": $scope.editarNom,
                "cognoms": $scope.editarCognom
            })


            $location.path('/llistaAutors');

        };
    });