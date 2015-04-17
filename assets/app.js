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
    .controller("LoginSession", function($scope, $location, UsersService) {
         $scope.$watchGroup(['username','password'],function(newVal, oldVal) {
                /*
                 * Vigilem les variables de l'$scope "username"
                 * i "password" per esborrar el missatge d'error
                 * si hi ha.
                 */
                if (newVal!=oldVal)
                    $scope.error=null;
                
            });
        $scope.login = function(username, password) {
            
            if (!username || !password) {
                console.log(username);
                username = null;
                password = null;

            } else {
                UsersService.login(username,password,
                    function(error,status) {
                        /*
                            Funció que s'executarà si hi ha un error en el login
                        */
                        if (status == 401) {
                                $scope.error = error.missatge;
                        }
                    }).success(function() {
                        UsersService.getUser().then(function(user){
                            /*
                                Si tot va bé, anem a la pàgina principal
                                i emeten un missatge de "login" per avisar
                                a la nostra app que l'usuari ha fet login
                                correctament.
                            */
                            $scope.$emit('login', user.data);  
                            $location.path('/');
                        });
                    });
            }
        };
        $scope.cancelarLogin = function(user) {

            $location.path('/');

        };
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
    .controller('NewUser', function($scope, $location, UsersService) {

        //Desenvolupem la funcio nouUsuari
        $scope.nouUsuari = function() {

            if (($scope.regUser != undefined) & ($scope.regPasswd != undefined) & ($scope.confPasswd != undefined)) {

                if ($scope.regPasswd === $scope.confPasswd) {

                    UsersService.create({
                        "username": $scope.regUser,
                        "password": $scope.regPasswd
                    }).success(function(user) {

                        $scope.regUser = null;
                        $scope.regPasswd = null;
                        $scope.confPasswd = null;
                    });

                    $location.path('/');

                } else {

                    $scope.regUser = null;
                    $scope.regPasswd = null;
                    $scope.confPasswd = null;

                    console.log("Error: les contrasenyes son diferents");

                }
            }
        };

        //Cancelem l'acció POST
        $scope.cancelarUsuari = function(user) {

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
                templateUrl: 'edit.html',
                autoritzat: true

            })
            .when("/nouLlibre", {
                controller: 'NewBook',
                templateUrl: 'new.html',
                autoritzat: true
            })
            .when("/iniciarSessio", {
                controller: 'LoginSession',
                templateUrl: 'login.html',
                autoritzat: false
            })
            .when("/usuariNou", {
                controller: 'NewUser',
                templateUrl: 'register.html',
                autoritzat: false
            })
            .otherwise({
                redirectTo: '/'
            });

        $locationProvider.html5Mode({
            enabled: true,
            requireBase: false
        });
    });
angular.module('app')
    .service("UsersService", function($http) {
        var srv = this;
        srv.auth = false;
        this.getUser = function() {
            return $http.get("/api/users");
        };
        srv.login = function(username, password, noLogin) {
            return $http.post('/api/sessions', {
                username: username,
                password: password
            }).success(function(data, status) {
                /*
                    Si l'autenticació és correcte li diem a l'angular que cada 
                    vegada que es comuniqui amb el servidor afegeixi el token 
                    al header 'x-auth'
                */
                $http.defaults.headers.common['x-auth'] = data;
                if (data) srv.auth = true;
            });
        };
        this.create = function(user) {
            return $http.post("/api/users", user);
        };
    });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS5qcyIsImVkaXQuanMiLCJsaXN0Qm9va3MuanMiLCJsbGlicmUuc3ZjLmpzIiwibG9naW4uY3RybC5qcyIsIm5ld0Jvb2suanMiLCJuZXdVc2VyLmpzIiwicm91dGVzLmpzIiwidXNlcnMuc3ZjLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2xDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzNCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQy9DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzNCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDeENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNyQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiYXBwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiYW5ndWxhci5tb2R1bGUoJ2FwcCcsIFsnbmdSb3V0ZSddKTsiLCJhbmd1bGFyLm1vZHVsZSgnYXBwJylcbiAgICAuY29udHJvbGxlcignRWRpdEJvb2tzJywgZnVuY3Rpb24oJHNjb3BlLCAkbG9jYXRpb24sIExsaWJyZXNTZXJ2aWNlKSB7XG4gICAgICAgXG4gICAgICAgICAgICBpZiAoTGxpYnJlc1NlcnZpY2UubGxpYnJlRWRpdGFyID09PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgJGxvY2F0aW9uLnBhdGgoJy8nKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAgICRzY29wZS5lZGl0YXJUaXRvbCA9IExsaWJyZXNTZXJ2aWNlLmxsaWJyZUVkaXRhci50aXRvbDtcbiAgICAgICAgICAgICRzY29wZS5lZGl0YXJJc2JuID0gTGxpYnJlc1NlcnZpY2UubGxpYnJlRWRpdGFyLmlzYm47XG5cbiAgICAgICAgICAgICRzY29wZS5sbGlicmVfRWRpdGFyID0gTGxpYnJlc1NlcnZpY2UubGxpYnJlRWRpdGFyO1xufVxuXG4gICAgICAgIC8vQ2FuY2VsZW0gbCdhY2Npw7MgUFVUXG4gICAgICAgICRzY29wZS5jYW5jZWxhckVkaWNpbyA9IGZ1bmN0aW9uKGxsaWJyZSkge1xuXG4gICAgICAgICAgICBMbGlicmVzU2VydmljZS5sbGlicmVFZGl0YXIgPSBudWxsO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICAkbG9jYXRpb24ucGF0aCgnLycpO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8vIFRyYXNwYXNzZW0gaW5mb3JtYWNpw7MgYSBsZXMgdmFyaWFibGVzIGRlbCBIVE1MXG4gICAgICAgICRzY29wZS5hY3R1YWxpdHphckxsaWJyZSA9IGZ1bmN0aW9uKGxsaWJyZSkge1xuXG5cbiAgICAgICAgICAgIExsaWJyZXNTZXJ2aWNlLnVwZGF0ZSgkc2NvcGUubGxpYnJlX0VkaXRhci5pc2JuLCB7XG4gICAgICAgICAgICAgICAgXCJ0aXRvbFwiOiAkc2NvcGUuZWRpdGFyVGl0b2wsXG4gICAgICAgICAgICAgICAgXCJpc2JuXCI6ICRzY29wZS5lZGl0YXJJc2JuXG4gICAgICAgICAgICB9KVxuXG5cbiAgICAgICAgICAgICRsb2NhdGlvbi5wYXRoKCcvJyk7XG5cbiAgICAgICAgfTtcbiAgICB9KTsiLCJhbmd1bGFyLm1vZHVsZSgnYXBwJylcbi5jb250cm9sbGVyKCdMaXN0Qm9va3MnLCBmdW5jdGlvbigkc2NvcGUsICRsb2NhdGlvbiwgTGxpYnJlc1NlcnZpY2UpIHtcbiAgICBMbGlicmVzU2VydmljZS5mZXRjaCgpXG4gICAgICAgIC5zdWNjZXNzKGZ1bmN0aW9uKGxsaWJyZXMpIHtcbiAgICAgICAgICAgICRzY29wZS5sbGlicmVzID0gbGxpYnJlcztcbiAgICAgICAgfSlcbiAgICAgICAgLmVycm9yKGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGUpO1xuICAgICAgICB9KTtcbiAgICAgICAgXG4gICAgICAgICAgLy9EZXNlbnZvbHVwZW0gbGEgZnVuY2lvIGVzYm9ycmFyIGxsaWJyZVxuICAgICRzY29wZS5ib3JyYXJMbGlicmUgPSBmdW5jdGlvbihsbGlicmUpIHtcblxuICAgICAgICBMbGlicmVzU2VydmljZS5kZWxldGUobGxpYnJlLmlzYm4pXG4gICAgICAgICAgICAuc3VjY2VzcyhmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAkc2NvcGUubGxpYnJlcy5zcGxpY2UoJHNjb3BlLmxsaWJyZXMuaW5kZXhPZihsbGlicmUpLCAxKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgfTtcbiAgICAvLyBUcmFzcGFzc2VtIGluZm9ybWFjacOzIGEgbGVzIHZhcmlhYmxlcyBkZWwgSFRNTFxuICAgICRzY29wZS5lZGl0YXJMbGlicmUgPSBmdW5jdGlvbihsbGlicmUpIHtcblxuICAgICAgICBMbGlicmVzU2VydmljZS5sbGlicmVFZGl0YXIgPSBsbGlicmU7XG4gICAgICAgIFxuICAgICAgICAkbG9jYXRpb24ucGF0aCgnL2VkaXRhckxsaWJyZScpO1xuICAgICAgICBcbiAgICB9O1xufSk7IiwiYW5ndWxhci5tb2R1bGUoJ2FwcCcpXG4uc2VydmljZShcIkxsaWJyZXNTZXJ2aWNlXCIsIGZ1bmN0aW9uKCRodHRwKSB7XG4gICAgdGhpcy5mZXRjaCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KFwiL2FwaS9sbGlicmVzXCIpO1xuICAgIH07XG4gICAgdGhpcy5jcmVhdGUgPSBmdW5jdGlvbihsbGlicmUpIHtcbiAgICAgICAgcmV0dXJuICRodHRwLnBvc3QoXCIvYXBpL2xsaWJyZXNcIiwgbGxpYnJlKTtcbiAgICB9O1xuICAgIHRoaXMuZGVsZXRlID0gZnVuY3Rpb24oaXNibikge1xuICAgICAgICByZXR1cm4gJGh0dHAuZGVsZXRlKFwiL2FwaS9sbGlicmVzL1wiICsgaXNibik7XG4gICAgfTtcbiAgICAvLyBMaSBwYXNzZW0gdW4ganNvbiBpIGVsIGlkIGRlbCBsbGlicmUgcXVlIHZvbGVtIGVkaXRhclxuICAgIHRoaXMudXBkYXRlID0gZnVuY3Rpb24oaXNibiwgbGxpYnJlKSB7XG4gICAgICAgIHJldHVybiAkaHR0cC5wdXQoXCIvYXBpL2xsaWJyZXMvXCIgKyBpc2JuLCBsbGlicmUpO1xuICAgIH07XG4gICAgdGhpcy5sbGlicmVFZGl0YXIgPSBudWxsO1xufSk7IiwiYW5ndWxhci5tb2R1bGUoJ2FwcCcpXG4gICAgLmNvbnRyb2xsZXIoXCJMb2dpblNlc3Npb25cIiwgZnVuY3Rpb24oJHNjb3BlLCAkbG9jYXRpb24sIFVzZXJzU2VydmljZSkge1xuICAgICAgICAgJHNjb3BlLiR3YXRjaEdyb3VwKFsndXNlcm5hbWUnLCdwYXNzd29yZCddLGZ1bmN0aW9uKG5ld1ZhbCwgb2xkVmFsKSB7XG4gICAgICAgICAgICAgICAgLypcbiAgICAgICAgICAgICAgICAgKiBWaWdpbGVtIGxlcyB2YXJpYWJsZXMgZGUgbCckc2NvcGUgXCJ1c2VybmFtZVwiXG4gICAgICAgICAgICAgICAgICogaSBcInBhc3N3b3JkXCIgcGVyIGVzYm9ycmFyIGVsIG1pc3NhdGdlIGQnZXJyb3JcbiAgICAgICAgICAgICAgICAgKiBzaSBoaSBoYS5cbiAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICBpZiAobmV3VmFsIT1vbGRWYWwpXG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5lcnJvcj1udWxsO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICRzY29wZS5sb2dpbiA9IGZ1bmN0aW9uKHVzZXJuYW1lLCBwYXNzd29yZCkge1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBpZiAoIXVzZXJuYW1lIHx8ICFwYXNzd29yZCkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHVzZXJuYW1lKTtcbiAgICAgICAgICAgICAgICB1c2VybmFtZSA9IG51bGw7XG4gICAgICAgICAgICAgICAgcGFzc3dvcmQgPSBudWxsO1xuXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIFVzZXJzU2VydmljZS5sb2dpbih1c2VybmFtZSxwYXNzd29yZCxcbiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24oZXJyb3Isc3RhdHVzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvKlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEZ1bmNpw7MgcXVlIHMnZXhlY3V0YXLDoCBzaSBoaSBoYSB1biBlcnJvciBlbiBlbCBsb2dpblxuICAgICAgICAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzdGF0dXMgPT0gNDAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5lcnJvciA9IGVycm9yLm1pc3NhdGdlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KS5zdWNjZXNzKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgVXNlcnNTZXJ2aWNlLmdldFVzZXIoKS50aGVuKGZ1bmN0aW9uKHVzZXIpe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFNpIHRvdCB2YSBiw6ksIGFuZW0gYSBsYSBww6BnaW5hIHByaW5jaXBhbFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpIGVtZXRlbiB1biBtaXNzYXRnZSBkZSBcImxvZ2luXCIgcGVyIGF2aXNhclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhIGxhIG5vc3RyYSBhcHAgcXVlIGwndXN1YXJpIGhhIGZldCBsb2dpblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb3JyZWN0YW1lbnQuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUuJGVtaXQoJ2xvZ2luJywgdXNlci5kYXRhKTsgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRsb2NhdGlvbi5wYXRoKCcvJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgICRzY29wZS5jYW5jZWxhckxvZ2luID0gZnVuY3Rpb24odXNlcikge1xuXG4gICAgICAgICAgICAkbG9jYXRpb24ucGF0aCgnLycpO1xuXG4gICAgICAgIH07XG4gICAgfSk7IiwiYW5ndWxhci5tb2R1bGUoJ2FwcCcpXG4uY29udHJvbGxlcignTmV3Qm9vaycsIGZ1bmN0aW9uKCRzY29wZSwgJGxvY2F0aW9uLCBMbGlicmVzU2VydmljZSkge1xuICAgIFxuICAgIC8vRGVzZW52b2x1cGVtIGxhIGZ1bmNpbyBhZmVnaXJMbGlicmVcbiAgICAkc2NvcGUuYWZlZ2lyTGxpYnJlID0gZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgaWYgKCgkc2NvcGUubGxpYnJlVGl0b2wgIT0gdW5kZWZpbmVkKSAmICgkc2NvcGUubGxpYnJlSXNibiAhPSB1bmRlZmluZWQpKSB7XG5cbiAgICAgICAgICAgIExsaWJyZXNTZXJ2aWNlLmNyZWF0ZSh7XG4gICAgICAgICAgICAgICAgXCJ0aXRvbFwiOiAkc2NvcGUubGxpYnJlVGl0b2wsXG4gICAgICAgICAgICAgICAgXCJpc2JuXCI6ICRzY29wZS5sbGlicmVJc2JuXG4gICAgICAgICAgICB9KS5zdWNjZXNzKGZ1bmN0aW9uKGxsaWJyZSkge1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICRzY29wZS5sbGlicmVJc2JuID0gbnVsbDtcbiAgICAgICAgICAgICAgICAkc2NvcGUubGxpYnJlVGl0b2wgPSBudWxsO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgICRsb2NhdGlvbi5wYXRoKCcvJyk7XG4gICAgfTtcbiAgICBcbiAgICAvL0NhbmNlbGVtIGwnYWNjacOzIFBPU1RcbiAgICAkc2NvcGUuY2FuY2VsYXJMbGlicmUgPSBmdW5jdGlvbihsbGlicmUpIHtcblxuICAgICAgICRsb2NhdGlvbi5wYXRoKCcvJyk7XG4gICAgfTtcbn0pOyIsImFuZ3VsYXIubW9kdWxlKCdhcHAnKVxuICAgIC5jb250cm9sbGVyKCdOZXdVc2VyJywgZnVuY3Rpb24oJHNjb3BlLCAkbG9jYXRpb24sIFVzZXJzU2VydmljZSkge1xuXG4gICAgICAgIC8vRGVzZW52b2x1cGVtIGxhIGZ1bmNpbyBub3VVc3VhcmlcbiAgICAgICAgJHNjb3BlLm5vdVVzdWFyaSA9IGZ1bmN0aW9uKCkge1xuXG4gICAgICAgICAgICBpZiAoKCRzY29wZS5yZWdVc2VyICE9IHVuZGVmaW5lZCkgJiAoJHNjb3BlLnJlZ1Bhc3N3ZCAhPSB1bmRlZmluZWQpICYgKCRzY29wZS5jb25mUGFzc3dkICE9IHVuZGVmaW5lZCkpIHtcblxuICAgICAgICAgICAgICAgIGlmICgkc2NvcGUucmVnUGFzc3dkID09PSAkc2NvcGUuY29uZlBhc3N3ZCkge1xuXG4gICAgICAgICAgICAgICAgICAgIFVzZXJzU2VydmljZS5jcmVhdGUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJ1c2VybmFtZVwiOiAkc2NvcGUucmVnVXNlcixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicGFzc3dvcmRcIjogJHNjb3BlLnJlZ1Bhc3N3ZFxuICAgICAgICAgICAgICAgICAgICB9KS5zdWNjZXNzKGZ1bmN0aW9uKHVzZXIpIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLnJlZ1VzZXIgPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLnJlZ1Bhc3N3ZCA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUuY29uZlBhc3N3ZCA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgICRsb2NhdGlvbi5wYXRoKCcvJyk7XG5cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5yZWdVc2VyID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLnJlZ1Bhc3N3ZCA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5jb25mUGFzc3dkID0gbnVsbDtcblxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkVycm9yOiBsZXMgY29udHJhc2VueWVzIHNvbiBkaWZlcmVudHNcIik7XG5cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgLy9DYW5jZWxlbSBsJ2FjY2nDsyBQT1NUXG4gICAgICAgICRzY29wZS5jYW5jZWxhclVzdWFyaSA9IGZ1bmN0aW9uKHVzZXIpIHtcblxuICAgICAgICAgICAgJGxvY2F0aW9uLnBhdGgoJy8nKTtcblxuICAgICAgICB9O1xuICAgIH0pOyIsImFuZ3VsYXIubW9kdWxlKCdhcHAnKVxuICAgIC5jb25maWcoZnVuY3Rpb24oJHJvdXRlUHJvdmlkZXIsICRsb2NhdGlvblByb3ZpZGVyKSB7XG4gICAgICAgICRyb3V0ZVByb3ZpZGVyXG4gICAgICAgICAgICAud2hlbihcIi9cIiwge1xuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdMaXN0Qm9va3MnLFxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnbGlzdC5odG1sJyxcbiAgICAgICAgICAgICAgICBhdXRvcml0emF0OiBmYWxzZVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC53aGVuKFwiL2VkaXRhckxsaWJyZVwiLCB7XG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ0VkaXRCb29rcycsXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdlZGl0Lmh0bWwnLFxuICAgICAgICAgICAgICAgIGF1dG9yaXR6YXQ6IHRydWVcblxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC53aGVuKFwiL25vdUxsaWJyZVwiLCB7XG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ05ld0Jvb2snLFxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnbmV3Lmh0bWwnLFxuICAgICAgICAgICAgICAgIGF1dG9yaXR6YXQ6IHRydWVcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAud2hlbihcIi9pbmljaWFyU2Vzc2lvXCIsIHtcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnTG9naW5TZXNzaW9uJyxcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ2xvZ2luLmh0bWwnLFxuICAgICAgICAgICAgICAgIGF1dG9yaXR6YXQ6IGZhbHNlXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLndoZW4oXCIvdXN1YXJpTm91XCIsIHtcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnTmV3VXNlcicsXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdyZWdpc3Rlci5odG1sJyxcbiAgICAgICAgICAgICAgICBhdXRvcml0emF0OiBmYWxzZVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5vdGhlcndpc2Uoe1xuICAgICAgICAgICAgICAgIHJlZGlyZWN0VG86ICcvJ1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgJGxvY2F0aW9uUHJvdmlkZXIuaHRtbDVNb2RlKHtcbiAgICAgICAgICAgIGVuYWJsZWQ6IHRydWUsXG4gICAgICAgICAgICByZXF1aXJlQmFzZTogZmFsc2VcbiAgICAgICAgfSk7XG4gICAgfSk7IiwiYW5ndWxhci5tb2R1bGUoJ2FwcCcpXG4gICAgLnNlcnZpY2UoXCJVc2Vyc1NlcnZpY2VcIiwgZnVuY3Rpb24oJGh0dHApIHtcbiAgICAgICAgdmFyIHNydiA9IHRoaXM7XG4gICAgICAgIHNydi5hdXRoID0gZmFsc2U7XG4gICAgICAgIHRoaXMuZ2V0VXNlciA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuICRodHRwLmdldChcIi9hcGkvdXNlcnNcIik7XG4gICAgICAgIH07XG4gICAgICAgIHNydi5sb2dpbiA9IGZ1bmN0aW9uKHVzZXJuYW1lLCBwYXNzd29yZCwgbm9Mb2dpbikge1xuICAgICAgICAgICAgcmV0dXJuICRodHRwLnBvc3QoJy9hcGkvc2Vzc2lvbnMnLCB7XG4gICAgICAgICAgICAgICAgdXNlcm5hbWU6IHVzZXJuYW1lLFxuICAgICAgICAgICAgICAgIHBhc3N3b3JkOiBwYXNzd29yZFxuICAgICAgICAgICAgfSkuc3VjY2VzcyhmdW5jdGlvbihkYXRhLCBzdGF0dXMpIHtcbiAgICAgICAgICAgICAgICAvKlxuICAgICAgICAgICAgICAgICAgICBTaSBsJ2F1dGVudGljYWNpw7Mgw6lzIGNvcnJlY3RlIGxpIGRpZW0gYSBsJ2FuZ3VsYXIgcXVlIGNhZGEgXG4gICAgICAgICAgICAgICAgICAgIHZlZ2FkYSBxdWUgZXMgY29tdW5pcXVpIGFtYiBlbCBzZXJ2aWRvciBhZmVnZWl4aSBlbCB0b2tlbiBcbiAgICAgICAgICAgICAgICAgICAgYWwgaGVhZGVyICd4LWF1dGgnXG4gICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICAkaHR0cC5kZWZhdWx0cy5oZWFkZXJzLmNvbW1vblsneC1hdXRoJ10gPSBkYXRhO1xuICAgICAgICAgICAgICAgIGlmIChkYXRhKSBzcnYuYXV0aCA9IHRydWU7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5jcmVhdGUgPSBmdW5jdGlvbih1c2VyKSB7XG4gICAgICAgICAgICByZXR1cm4gJGh0dHAucG9zdChcIi9hcGkvdXNlcnNcIiwgdXNlcik7XG4gICAgICAgIH07XG4gICAgfSk7Il0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9