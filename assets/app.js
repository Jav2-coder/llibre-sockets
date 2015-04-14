angular.module('app', ['ngRoute']);
angular.module('app')
    .controller('EditBooks', function($scope, $location, LlibresService) {
       
            if (LlibresService.llibreEditar === null) {
                $location.path('/');
            } else {

            $scope.editarTitol = LlibresService.llibreEditar.titol;
            $scope.editarIsbn = LlibresService.llibreEditar.isbn;

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS5qcyIsImVkaXQuanMiLCJsaXN0Qm9va3MuanMiLCJsbGlicmUuc3ZjLmpzIiwibmV3Qm9vay5qcyIsInJvdXRlcy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNsQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMzQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzNCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiYXBwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiYW5ndWxhci5tb2R1bGUoJ2FwcCcsIFsnbmdSb3V0ZSddKTsiLCJhbmd1bGFyLm1vZHVsZSgnYXBwJylcbiAgICAuY29udHJvbGxlcignRWRpdEJvb2tzJywgZnVuY3Rpb24oJHNjb3BlLCAkbG9jYXRpb24sIExsaWJyZXNTZXJ2aWNlKSB7XG4gICAgICAgXG4gICAgICAgICAgICBpZiAoTGxpYnJlc1NlcnZpY2UubGxpYnJlRWRpdGFyID09PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgJGxvY2F0aW9uLnBhdGgoJy8nKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAgICRzY29wZS5lZGl0YXJUaXRvbCA9IExsaWJyZXNTZXJ2aWNlLmxsaWJyZUVkaXRhci50aXRvbDtcbiAgICAgICAgICAgICRzY29wZS5lZGl0YXJJc2JuID0gTGxpYnJlc1NlcnZpY2UubGxpYnJlRWRpdGFyLmlzYm47XG5cbiAgICAgICAgICAgICRzY29wZS5sbGlicmVfRWRpdGFyID0gTGxpYnJlc1NlcnZpY2UubGxpYnJlRWRpdGFyO1xufVxuXG4gICAgICAgIC8vQ2FuY2VsZW0gbCdhY2Npw7MgUFVUXG4gICAgICAgICRzY29wZS5jYW5jZWxhckVkaWNpbyA9IGZ1bmN0aW9uKGxsaWJyZSkge1xuXG4gICAgICAgICAgICBMbGlicmVzU2VydmljZS5sbGlicmVFZGl0YXIgPSBudWxsO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICAkbG9jYXRpb24ucGF0aCgnLycpO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8vIFRyYXNwYXNzZW0gaW5mb3JtYWNpw7MgYSBsZXMgdmFyaWFibGVzIGRlbCBIVE1MXG4gICAgICAgICRzY29wZS5hY3R1YWxpdHphckxsaWJyZSA9IGZ1bmN0aW9uKGxsaWJyZSkge1xuXG5cbiAgICAgICAgICAgIExsaWJyZXNTZXJ2aWNlLnVwZGF0ZSgkc2NvcGUubGxpYnJlX0VkaXRhci5pc2JuLCB7XG4gICAgICAgICAgICAgICAgXCJ0aXRvbFwiOiAkc2NvcGUuZWRpdGFyVGl0b2wsXG4gICAgICAgICAgICAgICAgXCJpc2JuXCI6ICRzY29wZS5lZGl0YXJJc2JuXG4gICAgICAgICAgICB9KVxuXG5cbiAgICAgICAgICAgICRsb2NhdGlvbi5wYXRoKCcvJyk7XG5cbiAgICAgICAgfTtcbiAgICB9KTsiLCJhbmd1bGFyLm1vZHVsZSgnYXBwJylcbi5jb250cm9sbGVyKCdMaXN0Qm9va3MnLCBmdW5jdGlvbigkc2NvcGUsICRsb2NhdGlvbiwgTGxpYnJlc1NlcnZpY2UpIHtcbiAgICBMbGlicmVzU2VydmljZS5mZXRjaCgpXG4gICAgICAgIC5zdWNjZXNzKGZ1bmN0aW9uKGxsaWJyZXMpIHtcbiAgICAgICAgICAgICRzY29wZS5sbGlicmVzID0gbGxpYnJlcztcbiAgICAgICAgfSlcbiAgICAgICAgLmVycm9yKGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGUpO1xuICAgICAgICB9KTtcbiAgICAgICAgXG4gICAgICAgICAgLy9EZXNlbnZvbHVwZW0gbGEgZnVuY2lvIGVzYm9ycmFyIGxsaWJyZVxuICAgICRzY29wZS5ib3JyYXJMbGlicmUgPSBmdW5jdGlvbihsbGlicmUpIHtcblxuICAgICAgICBMbGlicmVzU2VydmljZS5kZWxldGUobGxpYnJlLmlzYm4pXG4gICAgICAgICAgICAuc3VjY2VzcyhmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAkc2NvcGUubGxpYnJlcy5zcGxpY2UoJHNjb3BlLmxsaWJyZXMuaW5kZXhPZihsbGlicmUpLCAxKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgfTtcbiAgICAvLyBUcmFzcGFzc2VtIGluZm9ybWFjacOzIGEgbGVzIHZhcmlhYmxlcyBkZWwgSFRNTFxuICAgICRzY29wZS5lZGl0YXJMbGlicmUgPSBmdW5jdGlvbihsbGlicmUpIHtcblxuICAgICAgICBMbGlicmVzU2VydmljZS5sbGlicmVFZGl0YXIgPSBsbGlicmU7XG4gICAgICAgIFxuICAgICAgICAkbG9jYXRpb24ucGF0aCgnL2VkaXRhckxsaWJyZScpO1xuICAgICAgICBcbiAgICB9O1xufSk7IiwiYW5ndWxhci5tb2R1bGUoJ2FwcCcpXG4uc2VydmljZShcIkxsaWJyZXNTZXJ2aWNlXCIsIGZ1bmN0aW9uKCRodHRwKSB7XG4gICAgdGhpcy5mZXRjaCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KFwiL2FwaS9sbGlicmVzXCIpO1xuICAgIH07XG4gICAgdGhpcy5jcmVhdGUgPSBmdW5jdGlvbihsbGlicmUpIHtcbiAgICAgICAgcmV0dXJuICRodHRwLnBvc3QoXCIvYXBpL2xsaWJyZXNcIiwgbGxpYnJlKTtcbiAgICB9O1xuICAgIHRoaXMuZGVsZXRlID0gZnVuY3Rpb24oaXNibikge1xuICAgICAgICByZXR1cm4gJGh0dHAuZGVsZXRlKFwiL2FwaS9sbGlicmVzL1wiICsgaXNibik7XG4gICAgfTtcbiAgICAvLyBMaSBwYXNzZW0gdW4ganNvbiBpIGVsIGlkIGRlbCBsbGlicmUgcXVlIHZvbGVtIGVkaXRhclxuICAgIHRoaXMudXBkYXRlID0gZnVuY3Rpb24oaXNibiwgbGxpYnJlKSB7XG4gICAgICAgIHJldHVybiAkaHR0cC5wdXQoXCIvYXBpL2xsaWJyZXMvXCIgKyBpc2JuLCBsbGlicmUpO1xuICAgIH07XG4gICAgdGhpcy5sbGlicmVFZGl0YXIgPSBudWxsO1xufSk7IiwiYW5ndWxhci5tb2R1bGUoJ2FwcCcpXG4uY29udHJvbGxlcignTmV3Qm9vaycsIGZ1bmN0aW9uKCRzY29wZSwgJGxvY2F0aW9uLCBMbGlicmVzU2VydmljZSkge1xuICAgIFxuICAgIC8vRGVzZW52b2x1cGVtIGxhIGZ1bmNpbyBhZmVnaXJMbGlicmVcbiAgICAkc2NvcGUuYWZlZ2lyTGxpYnJlID0gZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgaWYgKCgkc2NvcGUubGxpYnJlVGl0b2wgIT0gdW5kZWZpbmVkKSAmICgkc2NvcGUubGxpYnJlSXNibiAhPSB1bmRlZmluZWQpKSB7XG5cbiAgICAgICAgICAgIExsaWJyZXNTZXJ2aWNlLmNyZWF0ZSh7XG4gICAgICAgICAgICAgICAgXCJ0aXRvbFwiOiAkc2NvcGUubGxpYnJlVGl0b2wsXG4gICAgICAgICAgICAgICAgXCJpc2JuXCI6ICRzY29wZS5sbGlicmVJc2JuXG4gICAgICAgICAgICB9KS5zdWNjZXNzKGZ1bmN0aW9uKGxsaWJyZSkge1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICRzY29wZS5sbGlicmVJc2JuID0gbnVsbDtcbiAgICAgICAgICAgICAgICAkc2NvcGUubGxpYnJlVGl0b2wgPSBudWxsO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgICRsb2NhdGlvbi5wYXRoKCcvJyk7XG4gICAgfTtcbiAgICBcbiAgICAvL0NhbmNlbGVtIGwnYWNjacOzIFBPU1RcbiAgICAkc2NvcGUuY2FuY2VsYXJMbGlicmUgPSBmdW5jdGlvbihsbGlicmUpIHtcblxuICAgICAgICRsb2NhdGlvbi5wYXRoKCcvJyk7XG4gICAgfTtcbn0pOyIsImFuZ3VsYXIubW9kdWxlKCdhcHAnKVxuICAgIC5jb25maWcoZnVuY3Rpb24oJHJvdXRlUHJvdmlkZXIsICRsb2NhdGlvblByb3ZpZGVyKSB7XG4gICAgICAgICRyb3V0ZVByb3ZpZGVyXG4gICAgICAgICAgICAud2hlbihcIi9cIiwge1xuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdMaXN0Qm9va3MnLFxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnbGlzdC5odG1sJyxcbiAgICAgICAgICAgICAgICBhdXRvcml0emF0OiBmYWxzZVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC53aGVuKFwiL2VkaXRhckxsaWJyZVwiLCB7XG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ0VkaXRCb29rcycsXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdlZGl0Lmh0bWwnXG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLndoZW4oXCIvbm91TGxpYnJlXCIsIHtcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnTmV3Qm9vaycsXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICduZXcuaHRtbCdcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAub3RoZXJ3aXNlKHtcbiAgICAgICAgICAgICAgICByZWRpcmVjdFRvOiAnLydcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICAkbG9jYXRpb25Qcm92aWRlci5odG1sNU1vZGUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICBlbmFibGVkOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICByZXF1aXJlQmFzZTogZmFsc2VcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgIH0pOyJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==