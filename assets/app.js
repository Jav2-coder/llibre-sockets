angular.module('app', ['ngRoute']);
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

            LlibresService.llibreEditar = null;
            
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
angular.module('app')
.service("LlibresService", function($http) {
    this.fetch = function() {
        return $http.get("/api/llibres");
    };
    this.create = function(llibre) {
        return $http.post("/api/llibres", llibre);
    };
    this.delete = function(isbn) {
        return $http.delete("/api/llibres/" + isbn);
    };
    // Li passem un json i el id del llibre que volem editar
    this.update = function(isbn, llibre) {
        return $http.put("/api/llibres/" + isbn, llibre);
    };
    this.llibreEditar = null;
});
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

       $location.path('/');
    };
});
angular.module('app')
    .config(function($routeProvider, $locationProvider) {
        $routeProvider
            .when("/", {
                controller: 'ListBooks',
                templateUrl: 'list.html',
                autoritzat: false
            })
            .when("/editarLlibre", {
                controller: 'EditBooks',
                templateUrl: 'edit.html'
                
            })
            .when("/nouLlibre", {
                controller: 'NewBook',
                templateUrl: 'new.html'
                
            })
            .otherwise({
                redirectTo: '/'
            });
            
            $locationProvider.html5Mode({
                          enabled: true,
                          requireBase: false
                        });
    });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS5qcyIsImVkaXQuanMiLCJsaXN0Qm9va3MuanMiLCJsbGlicmUuc3ZjLmpzIiwibmV3Qm9vay5qcyIsInJvdXRlcy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNsQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMzQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzNCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiYXBwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiYW5ndWxhci5tb2R1bGUoJ2FwcCcsIFsnbmdSb3V0ZSddKTsiLCJhbmd1bGFyLm1vZHVsZSgnYXBwJylcbiAgICAuY29udHJvbGxlcignRWRpdEJvb2tzJywgZnVuY3Rpb24oJHNjb3BlLCAkbG9jYXRpb24sIExsaWJyZXNTZXJ2aWNlKSB7XG4gICAgICAgXG4gICAgICAgICAgICBpZiAoTGxpYnJlc1NlcnZpY2UubGxpYnJlRWRpdGFyID09PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgJGxvY2F0aW9uLnBhdGgoJy8nKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgJHNjb3BlLmVkaXRhclRpdG9sID0gTGxpYnJlc1NlcnZpY2UubGxpYnJlRWRpdGFyLnRpdG9sO1xuICAgICAgICAgICAgJHNjb3BlLmVkaXRhcklzYm4gPSBMbGlicmVzU2VydmljZS5sbGlicmVFZGl0YXIuaXNibjtcblxuICAgICAgICAgICAgJHNjb3BlLmxsaWJyZV9FZGl0YXIgPSBMbGlicmVzU2VydmljZS5sbGlicmVFZGl0YXI7XG5cblxuICAgICAgICAvL0NhbmNlbGVtIGwnYWNjacOzIFBVVFxuICAgICAgICAkc2NvcGUuY2FuY2VsYXJFZGljaW8gPSBmdW5jdGlvbihsbGlicmUpIHtcblxuICAgICAgICAgICAgTGxpYnJlc1NlcnZpY2UubGxpYnJlRWRpdGFyID0gbnVsbDtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgJGxvY2F0aW9uLnBhdGgoJy8nKTtcbiAgICAgICAgfTtcblxuICAgICAgICAvLyBUcmFzcGFzc2VtIGluZm9ybWFjacOzIGEgbGVzIHZhcmlhYmxlcyBkZWwgSFRNTFxuICAgICAgICAkc2NvcGUuYWN0dWFsaXR6YXJMbGlicmUgPSBmdW5jdGlvbihsbGlicmUpIHtcblxuXG4gICAgICAgICAgICBMbGlicmVzU2VydmljZS51cGRhdGUoJHNjb3BlLmxsaWJyZV9FZGl0YXIuaXNibiwge1xuICAgICAgICAgICAgICAgIFwidGl0b2xcIjogJHNjb3BlLmVkaXRhclRpdG9sLFxuICAgICAgICAgICAgICAgIFwiaXNiblwiOiAkc2NvcGUuZWRpdGFySXNiblxuICAgICAgICAgICAgfSlcblxuXG4gICAgICAgICAgICAkbG9jYXRpb24ucGF0aCgnLycpO1xuXG4gICAgICAgIH07XG4gICAgfSk7IiwiYW5ndWxhci5tb2R1bGUoJ2FwcCcpXG4uY29udHJvbGxlcignTGlzdEJvb2tzJywgZnVuY3Rpb24oJHNjb3BlLCAkbG9jYXRpb24sIExsaWJyZXNTZXJ2aWNlKSB7XG4gICAgTGxpYnJlc1NlcnZpY2UuZmV0Y2goKVxuICAgICAgICAuc3VjY2VzcyhmdW5jdGlvbihsbGlicmVzKSB7XG4gICAgICAgICAgICAkc2NvcGUubGxpYnJlcyA9IGxsaWJyZXM7XG4gICAgICAgIH0pXG4gICAgICAgIC5lcnJvcihmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhlKTtcbiAgICAgICAgfSk7XG4gICAgICAgIFxuICAgICAgICAgIC8vRGVzZW52b2x1cGVtIGxhIGZ1bmNpbyBlc2JvcnJhciBsbGlicmVcbiAgICAkc2NvcGUuYm9ycmFyTGxpYnJlID0gZnVuY3Rpb24obGxpYnJlKSB7XG5cbiAgICAgICAgTGxpYnJlc1NlcnZpY2UuZGVsZXRlKGxsaWJyZS5pc2JuKVxuICAgICAgICAgICAgLnN1Y2Nlc3MoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgJHNjb3BlLmxsaWJyZXMuc3BsaWNlKCRzY29wZS5sbGlicmVzLmluZGV4T2YobGxpYnJlKSwgMSk7XG4gICAgICAgICAgICB9KTtcblxuICAgIH07XG4gICAgLy8gVHJhc3Bhc3NlbSBpbmZvcm1hY2nDsyBhIGxlcyB2YXJpYWJsZXMgZGVsIEhUTUxcbiAgICAkc2NvcGUuZWRpdGFyTGxpYnJlID0gZnVuY3Rpb24obGxpYnJlKSB7XG5cbiAgICAgICAgTGxpYnJlc1NlcnZpY2UubGxpYnJlRWRpdGFyID0gbGxpYnJlO1xuICAgICAgICBcbiAgICAgICAgJGxvY2F0aW9uLnBhdGgoJy9lZGl0YXJMbGlicmUnKTtcbiAgICAgICAgXG4gICAgfTtcbn0pOyIsImFuZ3VsYXIubW9kdWxlKCdhcHAnKVxuLnNlcnZpY2UoXCJMbGlicmVzU2VydmljZVwiLCBmdW5jdGlvbigkaHR0cCkge1xuICAgIHRoaXMuZmV0Y2ggPSBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuICRodHRwLmdldChcIi9hcGkvbGxpYnJlc1wiKTtcbiAgICB9O1xuICAgIHRoaXMuY3JlYXRlID0gZnVuY3Rpb24obGxpYnJlKSB7XG4gICAgICAgIHJldHVybiAkaHR0cC5wb3N0KFwiL2FwaS9sbGlicmVzXCIsIGxsaWJyZSk7XG4gICAgfTtcbiAgICB0aGlzLmRlbGV0ZSA9IGZ1bmN0aW9uKGlzYm4pIHtcbiAgICAgICAgcmV0dXJuICRodHRwLmRlbGV0ZShcIi9hcGkvbGxpYnJlcy9cIiArIGlzYm4pO1xuICAgIH07XG4gICAgLy8gTGkgcGFzc2VtIHVuIGpzb24gaSBlbCBpZCBkZWwgbGxpYnJlIHF1ZSB2b2xlbSBlZGl0YXJcbiAgICB0aGlzLnVwZGF0ZSA9IGZ1bmN0aW9uKGlzYm4sIGxsaWJyZSkge1xuICAgICAgICByZXR1cm4gJGh0dHAucHV0KFwiL2FwaS9sbGlicmVzL1wiICsgaXNibiwgbGxpYnJlKTtcbiAgICB9O1xuICAgIHRoaXMubGxpYnJlRWRpdGFyID0gbnVsbDtcbn0pOyIsImFuZ3VsYXIubW9kdWxlKCdhcHAnKVxuLmNvbnRyb2xsZXIoJ05ld0Jvb2snLCBmdW5jdGlvbigkc2NvcGUsICRsb2NhdGlvbiwgTGxpYnJlc1NlcnZpY2UpIHtcbiAgICBcbiAgICAvL0Rlc2Vudm9sdXBlbSBsYSBmdW5jaW8gYWZlZ2lyTGxpYnJlXG4gICAgJHNjb3BlLmFmZWdpckxsaWJyZSA9IGZ1bmN0aW9uKCkge1xuXG4gICAgICAgIGlmICgoJHNjb3BlLmxsaWJyZVRpdG9sICE9IHVuZGVmaW5lZCkgJiAoJHNjb3BlLmxsaWJyZUlzYm4gIT0gdW5kZWZpbmVkKSkge1xuXG4gICAgICAgICAgICBMbGlicmVzU2VydmljZS5jcmVhdGUoe1xuICAgICAgICAgICAgICAgIFwidGl0b2xcIjogJHNjb3BlLmxsaWJyZVRpdG9sLFxuICAgICAgICAgICAgICAgIFwiaXNiblwiOiAkc2NvcGUubGxpYnJlSXNiblxuICAgICAgICAgICAgfSkuc3VjY2VzcyhmdW5jdGlvbihsbGlicmUpIHtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAkc2NvcGUubGxpYnJlSXNibiA9IG51bGw7XG4gICAgICAgICAgICAgICAgJHNjb3BlLmxsaWJyZVRpdG9sID0gbnVsbDtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICAkbG9jYXRpb24ucGF0aCgnLycpO1xuICAgIH07XG4gICAgXG4gICAgLy9DYW5jZWxlbSBsJ2FjY2nDsyBQT1NUXG4gICAgJHNjb3BlLmNhbmNlbGFyTGxpYnJlID0gZnVuY3Rpb24obGxpYnJlKSB7XG5cbiAgICAgICAkbG9jYXRpb24ucGF0aCgnLycpO1xuICAgIH07XG59KTsiLCJhbmd1bGFyLm1vZHVsZSgnYXBwJylcbiAgICAuY29uZmlnKGZ1bmN0aW9uKCRyb3V0ZVByb3ZpZGVyLCAkbG9jYXRpb25Qcm92aWRlcikge1xuICAgICAgICAkcm91dGVQcm92aWRlclxuICAgICAgICAgICAgLndoZW4oXCIvXCIsIHtcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnTGlzdEJvb2tzJyxcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ2xpc3QuaHRtbCcsXG4gICAgICAgICAgICAgICAgYXV0b3JpdHphdDogZmFsc2VcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAud2hlbihcIi9lZGl0YXJMbGlicmVcIiwge1xuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdFZGl0Qm9va3MnLFxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnZWRpdC5odG1sJ1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC53aGVuKFwiL25vdUxsaWJyZVwiLCB7XG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ05ld0Jvb2snLFxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnbmV3Lmh0bWwnXG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLm90aGVyd2lzZSh7XG4gICAgICAgICAgICAgICAgcmVkaXJlY3RUbzogJy8nXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgJGxvY2F0aW9uUHJvdmlkZXIuaHRtbDVNb2RlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgZW5hYmxlZDogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgcmVxdWlyZUJhc2U6IGZhbHNlXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICB9KTsiXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=