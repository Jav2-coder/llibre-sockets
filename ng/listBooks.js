angular.module('app')
    .controller('ListBooks', function($scope, $location, LlibresService, LlibreSocket) {
        $scope.llibres = [];
        $scope.$on('lista', function(o) {
            console.log('actualizar!');
            LlibresService.fetch()
                .success(function(llibres) {
                    $scope.llibres = llibres;
                })
                .error(function(e) {
                    console.log(e);
                });
        });
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
        $scope.$on('deleteBook', function() {
            var i;
            for (i in $scope.llibres) {
                if ($scope.llibres[i]._id == LlibreSocket.getLlibre()._id) {
                    $scope.llibres.splice(i, 1);
                }
            }
        });
        $scope.$on('newBook', function() {
            $scope.llibres.push(LlibreSocket.getLlibre());
        });
        $scope.$on('editBook', function() {
            var i;
            for (i in $scope.llibres) {
                if ($scope.llibres[i]._id == LlibreSocket.getLlibre()._id) {
                    $scope.llibres[i] = LlibreSocket.getLlibre();
                }
            }
        });
    });