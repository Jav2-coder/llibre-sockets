angular.module('app', ['ngRoute']);
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
        

        /*$scope.editarTitol = llibre.titol;
        $scope.editarIsbn = llibre.isbn;

        $scope.llibre_Editar = llibre;*/


    };
});
/*angular.module('app')
.controller('LlibresController', function($scope, LlibresService) {
    LlibresService.fetch()
        .success(function(llibres) {
            $scope.llibres = llibres;
        })
        .error(function(e) {
            console.log(e);
        });
    //Desenvolupem la funcio afegirLlibre
    $scope.afegirLlibre = function() {

        if (($scope.llibreTitol != undefined) & ($scope.llibreIsbn != undefined)) {

            LlibresService.create({
                "titol": $scope.llibreTitol,
                "isbn": $scope.llibreIsbn
            }).success(function(llibre) {
                $scope.llibres.unshift(llibre);
                $scope.llibreIsbn = null;
                $scope.llibreTitol = null;
            });
        }
    };

     //Desenvolupem la funcio esborrar llibre
    $scope.borrarLlibre = function(llibre) {

        LlibresService.delete(llibre.isbn)
            .success(function() {
                $scope.llibres.splice($scope.llibres.indexOf(llibre), 1);
            });

    };
    
    //Cancelem l'acció POST
    $scope.cancelarLlibre = function(llibre) {

        if (($scope.llibreTitol != undefined) & ($scope.llibreIsbn != undefined)) {
            
            $scope.llibreIsbn = null;
            $scope.llibreTitol = null; 
            
        }
    };
    
    //Cancelem l'acció PUT
    $scope.cancelarEdicio = function(llibre) {

        if (($scope.editarTitol != undefined) & ($scope.editarIsbn != undefined)) {
            
            $scope.editarIsbn = null;
            $scope.editarTitol = null; 
            
        }
    };

    // Traspassem informació a les variables del HTML
    $scope.editarLlibre = function(llibre) {

        $scope.editarTitol = llibre.titol;
        $scope.editarIsbn = llibre.isbn;

        $scope.llibre_Editar = llibre;


    };

    
    // Actualitzem les dades del llibre a editar
    $scope.actualitzarLlibre = function() {

        if (($scope.editarTitol != undefined) & ($scope.editarIsbn != undefined)) {

            LlibresService.update($scope.llibre_Editar.isbn, {
                    "titol": $scope.editarTitol,
                    "isbn": $scope.editarIsbn
                })
                .success(function() {
                    $scope.llibre_Editar.isbn = $scope.editarIsbn;
                    $scope.llibre_Editar.titol = $scope.editarTitol;
                   
                    $scope.editarIsbn = null;
                    $scope.editarTitol = null; 
                    
                });
        }
    };
});*/
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

        if (($scope.llibreTitol != undefined) & ($scope.llibreIsbn != undefined)) {
            
            $scope.llibreIsbn = null;
            $scope.llibreTitol = null; 
            
        }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS5qcyIsImVkaXQuanMiLCJsaXN0Qm9va3MuanMiLCJsbGlicmUuY3RybC5qcyIsImxsaWJyZS5zdmMuanMiLCJuZXdCb29rLmpzIiwicm91dGVzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDaENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNsQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3hGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiYXBwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiYW5ndWxhci5tb2R1bGUoJ2FwcCcsIFsnbmdSb3V0ZSddKTsiLCJhbmd1bGFyLm1vZHVsZSgnYXBwJylcbiAgICAuY29udHJvbGxlcignRWRpdEJvb2tzJywgZnVuY3Rpb24oJHNjb3BlLCAkbG9jYXRpb24sIExsaWJyZXNTZXJ2aWNlKSB7XG4gICAgICAgICRzY29wZS5lZGl0YXJUaXRvbCA9IExsaWJyZXNTZXJ2aWNlLmxsaWJyZUVkaXRhci50aXRvbDtcbiAgICAgICAgJHNjb3BlLmVkaXRhcklzYm4gPSBMbGlicmVzU2VydmljZS5sbGlicmVFZGl0YXIuaXNibjtcblxuICAgICAgICAkc2NvcGUubGxpYnJlX0VkaXRhciA9IExsaWJyZXNTZXJ2aWNlLmxsaWJyZUVkaXRhcjtcblxuICAgICAgICAvL0NhbmNlbGVtIGwnYWNjacOzIFBVVFxuICAgICAgICAkc2NvcGUuY2FuY2VsYXJFZGljaW8gPSBmdW5jdGlvbihsbGlicmUpIHtcblxuICAgICAgICAgICAgaWYgKCgkc2NvcGUuZWRpdGFyVGl0b2wgIT0gdW5kZWZpbmVkKSAmICgkc2NvcGUuZWRpdGFySXNibiAhPSB1bmRlZmluZWQpKSB7XG5cbiAgICAgICAgICAgICAgICAkc2NvcGUuZWRpdGFySXNibiA9IG51bGw7XG4gICAgICAgICAgICAgICAgJHNjb3BlLmVkaXRhclRpdG9sID0gbnVsbDtcblxuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIC8vIFRyYXNwYXNzZW0gaW5mb3JtYWNpw7MgYSBsZXMgdmFyaWFibGVzIGRlbCBIVE1MXG4gICAgICAgICRzY29wZS5hY3R1YWxpdHphckxsaWJyZSA9IGZ1bmN0aW9uKGxsaWJyZSkge1xuXG5cbiAgICAgICAgICAgIGlmICgoJHNjb3BlLmVkaXRhclRpdG9sICE9IHVuZGVmaW5lZCkgJiAoJHNjb3BlLmVkaXRhcklzYm4gIT0gdW5kZWZpbmVkKSkge1xuXG4gICAgICAgICAgICAgICAgTGxpYnJlc1NlcnZpY2UudXBkYXRlKCRzY29wZS5sbGlicmVfRWRpdGFyLmlzYm4sIHtcbiAgICAgICAgICAgICAgICAgICAgXCJ0aXRvbFwiOiAkc2NvcGUuZWRpdGFyVGl0b2wsXG4gICAgICAgICAgICAgICAgICAgIFwiaXNiblwiOiAkc2NvcGUuZWRpdGFySXNiblxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAkbG9jYXRpb24ucGF0aCgnLycpO1xuXG4gICAgICAgIH07XG4gICAgfSk7IiwiYW5ndWxhci5tb2R1bGUoJ2FwcCcpXG4uY29udHJvbGxlcignTGlzdEJvb2tzJywgZnVuY3Rpb24oJHNjb3BlLCAkbG9jYXRpb24sIExsaWJyZXNTZXJ2aWNlKSB7XG4gICAgTGxpYnJlc1NlcnZpY2UuZmV0Y2goKVxuICAgICAgICAuc3VjY2VzcyhmdW5jdGlvbihsbGlicmVzKSB7XG4gICAgICAgICAgICAkc2NvcGUubGxpYnJlcyA9IGxsaWJyZXM7XG4gICAgICAgIH0pXG4gICAgICAgIC5lcnJvcihmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhlKTtcbiAgICAgICAgfSk7XG4gICAgICAgIFxuICAgICAgICAgIC8vRGVzZW52b2x1cGVtIGxhIGZ1bmNpbyBlc2JvcnJhciBsbGlicmVcbiAgICAkc2NvcGUuYm9ycmFyTGxpYnJlID0gZnVuY3Rpb24obGxpYnJlKSB7XG5cbiAgICAgICAgTGxpYnJlc1NlcnZpY2UuZGVsZXRlKGxsaWJyZS5pc2JuKVxuICAgICAgICAgICAgLnN1Y2Nlc3MoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgJHNjb3BlLmxsaWJyZXMuc3BsaWNlKCRzY29wZS5sbGlicmVzLmluZGV4T2YobGxpYnJlKSwgMSk7XG4gICAgICAgICAgICB9KTtcblxuICAgIH07XG4gICAgLy8gVHJhc3Bhc3NlbSBpbmZvcm1hY2nDsyBhIGxlcyB2YXJpYWJsZXMgZGVsIEhUTUxcbiAgICAkc2NvcGUuZWRpdGFyTGxpYnJlID0gZnVuY3Rpb24obGxpYnJlKSB7XG5cbiAgICAgICAgTGxpYnJlc1NlcnZpY2UubGxpYnJlRWRpdGFyID0gbGxpYnJlO1xuICAgICAgICBcbiAgICAgICAgJGxvY2F0aW9uLnBhdGgoJy9lZGl0YXJMbGlicmUnKTtcbiAgICAgICAgXG5cbiAgICAgICAgLyokc2NvcGUuZWRpdGFyVGl0b2wgPSBsbGlicmUudGl0b2w7XG4gICAgICAgICRzY29wZS5lZGl0YXJJc2JuID0gbGxpYnJlLmlzYm47XG5cbiAgICAgICAgJHNjb3BlLmxsaWJyZV9FZGl0YXIgPSBsbGlicmU7Ki9cblxuXG4gICAgfTtcbn0pOyIsIi8qYW5ndWxhci5tb2R1bGUoJ2FwcCcpXG4uY29udHJvbGxlcignTGxpYnJlc0NvbnRyb2xsZXInLCBmdW5jdGlvbigkc2NvcGUsIExsaWJyZXNTZXJ2aWNlKSB7XG4gICAgTGxpYnJlc1NlcnZpY2UuZmV0Y2goKVxuICAgICAgICAuc3VjY2VzcyhmdW5jdGlvbihsbGlicmVzKSB7XG4gICAgICAgICAgICAkc2NvcGUubGxpYnJlcyA9IGxsaWJyZXM7XG4gICAgICAgIH0pXG4gICAgICAgIC5lcnJvcihmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhlKTtcbiAgICAgICAgfSk7XG4gICAgLy9EZXNlbnZvbHVwZW0gbGEgZnVuY2lvIGFmZWdpckxsaWJyZVxuICAgICRzY29wZS5hZmVnaXJMbGlicmUgPSBmdW5jdGlvbigpIHtcblxuICAgICAgICBpZiAoKCRzY29wZS5sbGlicmVUaXRvbCAhPSB1bmRlZmluZWQpICYgKCRzY29wZS5sbGlicmVJc2JuICE9IHVuZGVmaW5lZCkpIHtcblxuICAgICAgICAgICAgTGxpYnJlc1NlcnZpY2UuY3JlYXRlKHtcbiAgICAgICAgICAgICAgICBcInRpdG9sXCI6ICRzY29wZS5sbGlicmVUaXRvbCxcbiAgICAgICAgICAgICAgICBcImlzYm5cIjogJHNjb3BlLmxsaWJyZUlzYm5cbiAgICAgICAgICAgIH0pLnN1Y2Nlc3MoZnVuY3Rpb24obGxpYnJlKSB7XG4gICAgICAgICAgICAgICAgJHNjb3BlLmxsaWJyZXMudW5zaGlmdChsbGlicmUpO1xuICAgICAgICAgICAgICAgICRzY29wZS5sbGlicmVJc2JuID0gbnVsbDtcbiAgICAgICAgICAgICAgICAkc2NvcGUubGxpYnJlVGl0b2wgPSBudWxsO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgIC8vRGVzZW52b2x1cGVtIGxhIGZ1bmNpbyBlc2JvcnJhciBsbGlicmVcbiAgICAkc2NvcGUuYm9ycmFyTGxpYnJlID0gZnVuY3Rpb24obGxpYnJlKSB7XG5cbiAgICAgICAgTGxpYnJlc1NlcnZpY2UuZGVsZXRlKGxsaWJyZS5pc2JuKVxuICAgICAgICAgICAgLnN1Y2Nlc3MoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgJHNjb3BlLmxsaWJyZXMuc3BsaWNlKCRzY29wZS5sbGlicmVzLmluZGV4T2YobGxpYnJlKSwgMSk7XG4gICAgICAgICAgICB9KTtcblxuICAgIH07XG4gICAgXG4gICAgLy9DYW5jZWxlbSBsJ2FjY2nDsyBQT1NUXG4gICAgJHNjb3BlLmNhbmNlbGFyTGxpYnJlID0gZnVuY3Rpb24obGxpYnJlKSB7XG5cbiAgICAgICAgaWYgKCgkc2NvcGUubGxpYnJlVGl0b2wgIT0gdW5kZWZpbmVkKSAmICgkc2NvcGUubGxpYnJlSXNibiAhPSB1bmRlZmluZWQpKSB7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgICRzY29wZS5sbGlicmVJc2JuID0gbnVsbDtcbiAgICAgICAgICAgICRzY29wZS5sbGlicmVUaXRvbCA9IG51bGw7IFxuICAgICAgICAgICAgXG4gICAgICAgIH1cbiAgICB9O1xuICAgIFxuICAgIC8vQ2FuY2VsZW0gbCdhY2Npw7MgUFVUXG4gICAgJHNjb3BlLmNhbmNlbGFyRWRpY2lvID0gZnVuY3Rpb24obGxpYnJlKSB7XG5cbiAgICAgICAgaWYgKCgkc2NvcGUuZWRpdGFyVGl0b2wgIT0gdW5kZWZpbmVkKSAmICgkc2NvcGUuZWRpdGFySXNibiAhPSB1bmRlZmluZWQpKSB7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgICRzY29wZS5lZGl0YXJJc2JuID0gbnVsbDtcbiAgICAgICAgICAgICRzY29wZS5lZGl0YXJUaXRvbCA9IG51bGw7IFxuICAgICAgICAgICAgXG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgLy8gVHJhc3Bhc3NlbSBpbmZvcm1hY2nDsyBhIGxlcyB2YXJpYWJsZXMgZGVsIEhUTUxcbiAgICAkc2NvcGUuZWRpdGFyTGxpYnJlID0gZnVuY3Rpb24obGxpYnJlKSB7XG5cbiAgICAgICAgJHNjb3BlLmVkaXRhclRpdG9sID0gbGxpYnJlLnRpdG9sO1xuICAgICAgICAkc2NvcGUuZWRpdGFySXNibiA9IGxsaWJyZS5pc2JuO1xuXG4gICAgICAgICRzY29wZS5sbGlicmVfRWRpdGFyID0gbGxpYnJlO1xuXG5cbiAgICB9O1xuXG4gICAgXG4gICAgLy8gQWN0dWFsaXR6ZW0gbGVzIGRhZGVzIGRlbCBsbGlicmUgYSBlZGl0YXJcbiAgICAkc2NvcGUuYWN0dWFsaXR6YXJMbGlicmUgPSBmdW5jdGlvbigpIHtcblxuICAgICAgICBpZiAoKCRzY29wZS5lZGl0YXJUaXRvbCAhPSB1bmRlZmluZWQpICYgKCRzY29wZS5lZGl0YXJJc2JuICE9IHVuZGVmaW5lZCkpIHtcblxuICAgICAgICAgICAgTGxpYnJlc1NlcnZpY2UudXBkYXRlKCRzY29wZS5sbGlicmVfRWRpdGFyLmlzYm4sIHtcbiAgICAgICAgICAgICAgICAgICAgXCJ0aXRvbFwiOiAkc2NvcGUuZWRpdGFyVGl0b2wsXG4gICAgICAgICAgICAgICAgICAgIFwiaXNiblwiOiAkc2NvcGUuZWRpdGFySXNiblxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLnN1Y2Nlc3MoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5sbGlicmVfRWRpdGFyLmlzYm4gPSAkc2NvcGUuZWRpdGFySXNibjtcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmxsaWJyZV9FZGl0YXIudGl0b2wgPSAkc2NvcGUuZWRpdGFyVGl0b2w7XG4gICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5lZGl0YXJJc2JuID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmVkaXRhclRpdG9sID0gbnVsbDsgXG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfTtcbn0pOyovIiwiYW5ndWxhci5tb2R1bGUoJ2FwcCcpXG4uc2VydmljZShcIkxsaWJyZXNTZXJ2aWNlXCIsIGZ1bmN0aW9uKCRodHRwKSB7XG4gICAgdGhpcy5mZXRjaCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KFwiL2FwaS9sbGlicmVzXCIpO1xuICAgIH07XG4gICAgdGhpcy5jcmVhdGUgPSBmdW5jdGlvbihsbGlicmUpIHtcbiAgICAgICAgcmV0dXJuICRodHRwLnBvc3QoXCIvYXBpL2xsaWJyZXNcIiwgbGxpYnJlKTtcbiAgICB9O1xuICAgIHRoaXMuZGVsZXRlID0gZnVuY3Rpb24oaXNibikge1xuICAgICAgICByZXR1cm4gJGh0dHAuZGVsZXRlKFwiL2FwaS9sbGlicmVzL1wiICsgaXNibik7XG4gICAgfTtcbiAgICAvLyBMaSBwYXNzZW0gdW4ganNvbiBpIGVsIGlkIGRlbCBsbGlicmUgcXVlIHZvbGVtIGVkaXRhclxuICAgIHRoaXMudXBkYXRlID0gZnVuY3Rpb24oaXNibiwgbGxpYnJlKSB7XG4gICAgICAgIHJldHVybiAkaHR0cC5wdXQoXCIvYXBpL2xsaWJyZXMvXCIgKyBpc2JuLCBsbGlicmUpO1xuICAgIH07XG4gICAgdGhpcy5sbGlicmVFZGl0YXIgPSBudWxsO1xufSk7IiwiYW5ndWxhci5tb2R1bGUoJ2FwcCcpXG4uY29udHJvbGxlcignTmV3Qm9vaycsIGZ1bmN0aW9uKCRzY29wZSwgJGxvY2F0aW9uLCBMbGlicmVzU2VydmljZSkge1xuICAgIFxuICAgIC8vRGVzZW52b2x1cGVtIGxhIGZ1bmNpbyBhZmVnaXJMbGlicmVcbiAgICAkc2NvcGUuYWZlZ2lyTGxpYnJlID0gZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgaWYgKCgkc2NvcGUubGxpYnJlVGl0b2wgIT0gdW5kZWZpbmVkKSAmICgkc2NvcGUubGxpYnJlSXNibiAhPSB1bmRlZmluZWQpKSB7XG5cbiAgICAgICAgICAgIExsaWJyZXNTZXJ2aWNlLmNyZWF0ZSh7XG4gICAgICAgICAgICAgICAgXCJ0aXRvbFwiOiAkc2NvcGUubGxpYnJlVGl0b2wsXG4gICAgICAgICAgICAgICAgXCJpc2JuXCI6ICRzY29wZS5sbGlicmVJc2JuXG4gICAgICAgICAgICB9KS5zdWNjZXNzKGZ1bmN0aW9uKGxsaWJyZSkge1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICRzY29wZS5sbGlicmVJc2JuID0gbnVsbDtcbiAgICAgICAgICAgICAgICAkc2NvcGUubGxpYnJlVGl0b2wgPSBudWxsO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgICRsb2NhdGlvbi5wYXRoKCcvJyk7XG4gICAgfTtcbiAgICBcbiAgICAvL0NhbmNlbGVtIGwnYWNjacOzIFBPU1RcbiAgICAkc2NvcGUuY2FuY2VsYXJMbGlicmUgPSBmdW5jdGlvbihsbGlicmUpIHtcblxuICAgICAgICBpZiAoKCRzY29wZS5sbGlicmVUaXRvbCAhPSB1bmRlZmluZWQpICYgKCRzY29wZS5sbGlicmVJc2JuICE9IHVuZGVmaW5lZCkpIHtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgJHNjb3BlLmxsaWJyZUlzYm4gPSBudWxsO1xuICAgICAgICAgICAgJHNjb3BlLmxsaWJyZVRpdG9sID0gbnVsbDsgXG4gICAgICAgICAgICBcbiAgICAgICAgfVxuICAgIH07XG59KTsiLCJhbmd1bGFyLm1vZHVsZSgnYXBwJylcbiAgICAuY29uZmlnKGZ1bmN0aW9uKCRyb3V0ZVByb3ZpZGVyLCAkbG9jYXRpb25Qcm92aWRlcikge1xuICAgICAgICAkcm91dGVQcm92aWRlclxuICAgICAgICAgICAgLndoZW4oXCIvXCIsIHtcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnTGlzdEJvb2tzJyxcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ2xpc3QuaHRtbCcsXG4gICAgICAgICAgICAgICAgYXV0b3JpdHphdDogZmFsc2VcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAud2hlbihcIi9lZGl0YXJMbGlicmVcIiwge1xuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdFZGl0Qm9va3MnLFxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnZWRpdC5odG1sJ1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC53aGVuKFwiL25vdUxsaWJyZVwiLCB7XG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ05ld0Jvb2snLFxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnbmV3Lmh0bWwnXG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLm90aGVyd2lzZSh7XG4gICAgICAgICAgICAgICAgcmVkaXJlY3RUbzogJy8nXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgJGxvY2F0aW9uUHJvdmlkZXIuaHRtbDVNb2RlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgZW5hYmxlZDogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgcmVxdWlyZUJhc2U6IGZhbHNlXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICB9KTsiXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=