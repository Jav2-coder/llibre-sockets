angular.module('app', ['ngRoute']);
angular.module('app')
    .controller("ApplicationController", function($scope,$location,UsersService) {
        $scope.$on('login', function(e,user) {
            /*
                Quan s'ha fet login s'emet l'event "login"
                i això fa que la variable de l'scope "currentUser"
                li diem quin usuari s'ha autenticant, d'aquesta manera
                fem que apareguin diferents opcions al menú
            */
            $scope.currentUser = user;
        });
        $scope.logout = function(){
            /*
                Quan fem logout esborrem el token i la variable
                de l'$scope "currentUser", d'aquesta forma desapareixen
                els menús sensibles a la autenticació
            */
            UsersService.logOut();
            delete $scope.currentUser;
            $location.path('/');
        };
    });
angular.module('app')
.service("AutorService", function($http) {
    this.fetch = function() {
        return $http.get("/api/autors");
    };
    this.create = function(autors) {
        return $http.post("/api/autors", autors);
    };
    this.delete = function(_id) {
        return $http.delete("/api/autors/" + _id);
    };
    // Li passem un json i el id del autors que volem editar
    this.update = function(_id, autors) {
        return $http.put("/api/autors/" + _id, autors);
    };
    this.autorsEditar = null;
});
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
angular.module('app')
.controller('ListAutors', function($scope, $location, AutorService) {
    AutorService.fetch()
        .success(function(autors) {
            $scope.autors = autors;
        })
        .error(function(e) {
            console.log(e);
        });
        
          //Desenvolupem la funcio esborrar autors
    $scope.borrarAutor = function(autors) {
console.log(autors);
        AutorService.delete(autors._id)
            .success(function() {
                $scope.autors.splice($scope.autors.indexOf(autors), 1);
            });

    };
    // Traspassem informació a les variables del HTML
    $scope.editarAutor = function(autors) {

        AutorService.autorsEditar = autors;
        
        $location.path('/editAutor');
        
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
.controller('NewAutor', function($scope, $location, AutorService) {
    
    //Desenvolupem la funcio afegirAutor
    $scope.afegirAutor = function() {

        if (($scope.autorNom != undefined) & ($scope.autorCognom != undefined)) {

           AutorService.create({
                "nom": $scope.autorNom,
                "cognoms": $scope.autorCognom
            }).success(function(autors) {
                
                $scope.autorNom = null;
                $scope.autorCognom = null;
                
            });
        }
        
        $location.path('/llistaAutors');
    };
    
    //Cancelem l'acció POST
    $scope.cancelarAutor = function(autors) {

       $location.path('/llistaAutors');
    };
});
angular.module('app')
.controller('NewBook', function($scope, $location, LlibresService, AutorService) {

    AutorService.fetch()
        .success(function(autors) {
            $scope.autors = autors;
        });
    
    //Desenvolupem la funcio afegirLlibre
    $scope.afegirLlibre = function() {

        if (($scope.llibreTitol != undefined) & ($scope.llibreIsbn != undefined)) {

            LlibresService.create({
                "titol": $scope.llibreTitol,
                "isbn": $scope.llibreIsbn,
                "autors" : $scope.llibreAutor
            }).success(function(llibre) {
                
                $scope.llibreIsbn = null;
                $scope.llibreTitol = null;
                $scope.llibreAutor = null;
                
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
            .when("/llistaAutors", {
                controller: 'ListAutors',
                templateUrl: 'listAutors.html',
                autoritzat: false
            })
            .when("/editarLlibre", {
                controller: 'EditBooks',
                templateUrl: 'edit.html',
                autoritzat: true

            })
            .when("/editAutor", {
                controller: 'EditAutor',
                templateUrl: 'editAutor.html',
                autoritzat: true

            })
            .when("/nouAutor", {
                controller: 'NewAutor',
                templateUrl: 'newAutor.html',
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
    }).run(function($rootScope,UsersService) {
        /*
            Cada vegada que canviem de pàgina se dispara el
            event $routeChangeStart,
            Si la pàgina que volem veure té la propietat 
            "autoritzat": a true i no ho està llavors no 
            farà el canvi
        */
        $rootScope.$on('$routeChangeStart', function(event, next) {
           if (next)
                if (!UsersService.auth & next.autoritzat) 
                    event.preventDefault();
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
        this.logOut = function() {
            srv.auth = false;
            $http.defaults.headers.common['x-auth'] ="";
        };
    });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS5qcyIsImFwcGxpY2F0aW9uLmN0cmwuanMiLCJhdXRvci5zdmMuanMiLCJlZGl0LmpzIiwiZWRpdEF1dG9yLmpzIiwibGlzdEF1dG9ycy5qcyIsImxpc3RCb29rcy5qcyIsImxsaWJyZS5zdmMuanMiLCJsb2dpbi5jdHJsLmpzIiwibmV3QXV0b3IuanMiLCJuZXdCb29rLmpzIiwibmV3VXNlci5qcyIsInJvdXRlcy5qcyIsInVzZXJzLnN2Yy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDekNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNsQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMzQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMzQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMvQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMzQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2xDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDeENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJhcHAuanMiLCJzb3VyY2VzQ29udGVudCI6WyJhbmd1bGFyLm1vZHVsZSgnYXBwJywgWyduZ1JvdXRlJ10pOyIsImFuZ3VsYXIubW9kdWxlKCdhcHAnKVxuICAgIC5jb250cm9sbGVyKFwiQXBwbGljYXRpb25Db250cm9sbGVyXCIsIGZ1bmN0aW9uKCRzY29wZSwkbG9jYXRpb24sVXNlcnNTZXJ2aWNlKSB7XG4gICAgICAgICRzY29wZS4kb24oJ2xvZ2luJywgZnVuY3Rpb24oZSx1c2VyKSB7XG4gICAgICAgICAgICAvKlxuICAgICAgICAgICAgICAgIFF1YW4gcydoYSBmZXQgbG9naW4gcydlbWV0IGwnZXZlbnQgXCJsb2dpblwiXG4gICAgICAgICAgICAgICAgaSBhaXjDsiBmYSBxdWUgbGEgdmFyaWFibGUgZGUgbCdzY29wZSBcImN1cnJlbnRVc2VyXCJcbiAgICAgICAgICAgICAgICBsaSBkaWVtIHF1aW4gdXN1YXJpIHMnaGEgYXV0ZW50aWNhbnQsIGQnYXF1ZXN0YSBtYW5lcmFcbiAgICAgICAgICAgICAgICBmZW0gcXVlIGFwYXJlZ3VpbiBkaWZlcmVudHMgb3BjaW9ucyBhbCBtZW7DulxuICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICRzY29wZS5jdXJyZW50VXNlciA9IHVzZXI7XG4gICAgICAgIH0pO1xuICAgICAgICAkc2NvcGUubG9nb3V0ID0gZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIC8qXG4gICAgICAgICAgICAgICAgUXVhbiBmZW0gbG9nb3V0IGVzYm9ycmVtIGVsIHRva2VuIGkgbGEgdmFyaWFibGVcbiAgICAgICAgICAgICAgICBkZSBsJyRzY29wZSBcImN1cnJlbnRVc2VyXCIsIGQnYXF1ZXN0YSBmb3JtYSBkZXNhcGFyZWl4ZW5cbiAgICAgICAgICAgICAgICBlbHMgbWVuw7pzIHNlbnNpYmxlcyBhIGxhIGF1dGVudGljYWNpw7NcbiAgICAgICAgICAgICovXG4gICAgICAgICAgICBVc2Vyc1NlcnZpY2UubG9nT3V0KCk7XG4gICAgICAgICAgICBkZWxldGUgJHNjb3BlLmN1cnJlbnRVc2VyO1xuICAgICAgICAgICAgJGxvY2F0aW9uLnBhdGgoJy8nKTtcbiAgICAgICAgfTtcbiAgICB9KTsiLCJhbmd1bGFyLm1vZHVsZSgnYXBwJylcbi5zZXJ2aWNlKFwiQXV0b3JTZXJ2aWNlXCIsIGZ1bmN0aW9uKCRodHRwKSB7XG4gICAgdGhpcy5mZXRjaCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KFwiL2FwaS9hdXRvcnNcIik7XG4gICAgfTtcbiAgICB0aGlzLmNyZWF0ZSA9IGZ1bmN0aW9uKGF1dG9ycykge1xuICAgICAgICByZXR1cm4gJGh0dHAucG9zdChcIi9hcGkvYXV0b3JzXCIsIGF1dG9ycyk7XG4gICAgfTtcbiAgICB0aGlzLmRlbGV0ZSA9IGZ1bmN0aW9uKF9pZCkge1xuICAgICAgICByZXR1cm4gJGh0dHAuZGVsZXRlKFwiL2FwaS9hdXRvcnMvXCIgKyBfaWQpO1xuICAgIH07XG4gICAgLy8gTGkgcGFzc2VtIHVuIGpzb24gaSBlbCBpZCBkZWwgYXV0b3JzIHF1ZSB2b2xlbSBlZGl0YXJcbiAgICB0aGlzLnVwZGF0ZSA9IGZ1bmN0aW9uKF9pZCwgYXV0b3JzKSB7XG4gICAgICAgIHJldHVybiAkaHR0cC5wdXQoXCIvYXBpL2F1dG9ycy9cIiArIF9pZCwgYXV0b3JzKTtcbiAgICB9O1xuICAgIHRoaXMuYXV0b3JzRWRpdGFyID0gbnVsbDtcbn0pOyIsImFuZ3VsYXIubW9kdWxlKCdhcHAnKVxuICAgIC5jb250cm9sbGVyKCdFZGl0Qm9va3MnLCBmdW5jdGlvbigkc2NvcGUsICRsb2NhdGlvbiwgTGxpYnJlc1NlcnZpY2UsIEF1dG9yU2VydmljZSkge1xuICAgICAgIFxuICAgICAgICBBdXRvclNlcnZpY2UuZmV0Y2goKVxuICAgICAgICAuc3VjY2VzcyhmdW5jdGlvbihhdXRvcnMpIHtcbiAgICAgICAgICAgICRzY29wZS5hdXRvcnMgPSBhdXRvcnM7XG4gICAgICAgIH0pO1xuICAgICAgIFxuICAgICAgICAgICAgaWYgKExsaWJyZXNTZXJ2aWNlLmxsaWJyZUVkaXRhciA9PT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICRsb2NhdGlvbi5wYXRoKCcvJyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgICAkc2NvcGUuZWRpdGFyVGl0b2wgPSBMbGlicmVzU2VydmljZS5sbGlicmVFZGl0YXIudGl0b2w7XG4gICAgICAgICAgICAkc2NvcGUuZWRpdGFySXNibiA9IExsaWJyZXNTZXJ2aWNlLmxsaWJyZUVkaXRhci5pc2JuO1xuICAgICAgICAgICAgJHNjb3BlLmVkaXRhckF1dG9yID0gTGxpYnJlc1NlcnZpY2UubGxpYnJlRWRpdGFyLmF1dG9ycztcblxuICAgICAgICAgICAgJHNjb3BlLmxsaWJyZV9FZGl0YXIgPSBMbGlicmVzU2VydmljZS5sbGlicmVFZGl0YXI7XG59XG5cbiAgICAgICAgLy9DYW5jZWxlbSBsJ2FjY2nDsyBQVVRcbiAgICAgICAgJHNjb3BlLmNhbmNlbGFyRWRpY2lvID0gZnVuY3Rpb24obGxpYnJlKSB7XG5cbiAgICAgICAgICAgIExsaWJyZXNTZXJ2aWNlLmxsaWJyZUVkaXRhciA9IG51bGw7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgICRsb2NhdGlvbi5wYXRoKCcvJyk7XG4gICAgICAgIH07XG5cbiAgICAgICAgLy8gVHJhc3Bhc3NlbSBpbmZvcm1hY2nDsyBhIGxlcyB2YXJpYWJsZXMgZGVsIEhUTUxcbiAgICAgICAgJHNjb3BlLmFjdHVhbGl0emFyTGxpYnJlID0gZnVuY3Rpb24obGxpYnJlKSB7XG5cblxuICAgICAgICAgICAgTGxpYnJlc1NlcnZpY2UudXBkYXRlKCRzY29wZS5sbGlicmVfRWRpdGFyLmlzYm4sIHtcbiAgICAgICAgICAgICAgICBcInRpdG9sXCI6ICRzY29wZS5lZGl0YXJUaXRvbCxcbiAgICAgICAgICAgICAgICBcImlzYm5cIjogJHNjb3BlLmVkaXRhcklzYm4sXG4gICAgICAgICAgICAgICAgXCJhdXRvcnNcIjogJHNjb3BlLmVkaXRhckF1dG9yXG4gICAgICAgICAgICB9KVxuXG5cbiAgICAgICAgICAgICRsb2NhdGlvbi5wYXRoKCcvJyk7XG5cbiAgICAgICAgfTtcbiAgICB9KTsiLCJhbmd1bGFyLm1vZHVsZSgnYXBwJylcbiAgICAuY29udHJvbGxlcignRWRpdEF1dG9yJywgZnVuY3Rpb24oJHNjb3BlLCAkbG9jYXRpb24sIEF1dG9yU2VydmljZSkge1xuICAgICAgIFxuICAgICAgICAgICAgaWYgKEF1dG9yU2VydmljZS5hdXRvcnNFZGl0YXIgPT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAkbG9jYXRpb24ucGF0aCgnL2xsaXN0YUF1dG9ycycpO1xuICAgICAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICAgICAgJHNjb3BlLmVkaXRhck5vbSA9IEF1dG9yU2VydmljZS5hdXRvcnNFZGl0YXIubm9tO1xuICAgICAgICAgICAgJHNjb3BlLmVkaXRhckNvZ25vbSA9IEF1dG9yU2VydmljZS5hdXRvcnNFZGl0YXIuY29nbm9tcztcblxuICAgICAgICAgICAgJHNjb3BlLmF1dG9yX0VkaXRhciA9IEF1dG9yU2VydmljZS5hdXRvcnNFZGl0YXI7XG59XG5cbiAgICAgICAgLy9DYW5jZWxlbSBsJ2FjY2nDsyBQVVRcbiAgICAgICAgJHNjb3BlLmNhbmNlbGFyQXV0b3IgPSBmdW5jdGlvbihhdXRvcnMpIHtcblxuICAgICAgICAgICAgQXV0b3JTZXJ2aWNlLmF1dG9yc0VkaXRhciA9IG51bGw7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgICRsb2NhdGlvbi5wYXRoKCcvbGxpc3RhQXV0b3JzJyk7XG4gICAgICAgIH07XG5cbiAgICAgICAgLy8gVHJhc3Bhc3NlbSBpbmZvcm1hY2nDsyBhIGxlcyB2YXJpYWJsZXMgZGVsIEhUTUxcbiAgICAgICAgJHNjb3BlLmFjdHVhbGl0emFyQXV0b3IgPSBmdW5jdGlvbihhdXRvcnMpIHtcblxuXG4gICAgICAgICAgICBBdXRvclNlcnZpY2UudXBkYXRlKCRzY29wZS5hdXRvcl9FZGl0YXIuX2lkLCB7XG4gICAgICAgICAgICAgICAgXCJub21cIjogJHNjb3BlLmVkaXRhck5vbSxcbiAgICAgICAgICAgICAgICBcImNvZ25vbXNcIjogJHNjb3BlLmVkaXRhckNvZ25vbVxuICAgICAgICAgICAgfSlcblxuXG4gICAgICAgICAgICAkbG9jYXRpb24ucGF0aCgnL2xsaXN0YUF1dG9ycycpO1xuXG4gICAgICAgIH07XG4gICAgfSk7IiwiYW5ndWxhci5tb2R1bGUoJ2FwcCcpXG4uY29udHJvbGxlcignTGlzdEF1dG9ycycsIGZ1bmN0aW9uKCRzY29wZSwgJGxvY2F0aW9uLCBBdXRvclNlcnZpY2UpIHtcbiAgICBBdXRvclNlcnZpY2UuZmV0Y2goKVxuICAgICAgICAuc3VjY2VzcyhmdW5jdGlvbihhdXRvcnMpIHtcbiAgICAgICAgICAgICRzY29wZS5hdXRvcnMgPSBhdXRvcnM7XG4gICAgICAgIH0pXG4gICAgICAgIC5lcnJvcihmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhlKTtcbiAgICAgICAgfSk7XG4gICAgICAgIFxuICAgICAgICAgIC8vRGVzZW52b2x1cGVtIGxhIGZ1bmNpbyBlc2JvcnJhciBhdXRvcnNcbiAgICAkc2NvcGUuYm9ycmFyQXV0b3IgPSBmdW5jdGlvbihhdXRvcnMpIHtcbmNvbnNvbGUubG9nKGF1dG9ycyk7XG4gICAgICAgIEF1dG9yU2VydmljZS5kZWxldGUoYXV0b3JzLl9pZClcbiAgICAgICAgICAgIC5zdWNjZXNzKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICRzY29wZS5hdXRvcnMuc3BsaWNlKCRzY29wZS5hdXRvcnMuaW5kZXhPZihhdXRvcnMpLCAxKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgfTtcbiAgICAvLyBUcmFzcGFzc2VtIGluZm9ybWFjacOzIGEgbGVzIHZhcmlhYmxlcyBkZWwgSFRNTFxuICAgICRzY29wZS5lZGl0YXJBdXRvciA9IGZ1bmN0aW9uKGF1dG9ycykge1xuXG4gICAgICAgIEF1dG9yU2VydmljZS5hdXRvcnNFZGl0YXIgPSBhdXRvcnM7XG4gICAgICAgIFxuICAgICAgICAkbG9jYXRpb24ucGF0aCgnL2VkaXRBdXRvcicpO1xuICAgICAgICBcbiAgICB9O1xufSk7IiwiYW5ndWxhci5tb2R1bGUoJ2FwcCcpXG4uY29udHJvbGxlcignTGlzdEJvb2tzJywgZnVuY3Rpb24oJHNjb3BlLCAkbG9jYXRpb24sIExsaWJyZXNTZXJ2aWNlKSB7XG4gICAgTGxpYnJlc1NlcnZpY2UuZmV0Y2goKVxuICAgICAgICAuc3VjY2VzcyhmdW5jdGlvbihsbGlicmVzKSB7XG4gICAgICAgICAgICAkc2NvcGUubGxpYnJlcyA9IGxsaWJyZXM7XG4gICAgICAgIH0pXG4gICAgICAgIC5lcnJvcihmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhlKTtcbiAgICAgICAgfSk7XG4gICAgICAgIFxuICAgICAgICAgIC8vRGVzZW52b2x1cGVtIGxhIGZ1bmNpbyBlc2JvcnJhciBsbGlicmVcbiAgICAkc2NvcGUuYm9ycmFyTGxpYnJlID0gZnVuY3Rpb24obGxpYnJlKSB7XG5cbiAgICAgICAgTGxpYnJlc1NlcnZpY2UuZGVsZXRlKGxsaWJyZS5pc2JuKVxuICAgICAgICAgICAgLnN1Y2Nlc3MoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgJHNjb3BlLmxsaWJyZXMuc3BsaWNlKCRzY29wZS5sbGlicmVzLmluZGV4T2YobGxpYnJlKSwgMSk7XG4gICAgICAgICAgICB9KTtcblxuICAgIH07XG4gICAgLy8gVHJhc3Bhc3NlbSBpbmZvcm1hY2nDsyBhIGxlcyB2YXJpYWJsZXMgZGVsIEhUTUxcbiAgICAkc2NvcGUuZWRpdGFyTGxpYnJlID0gZnVuY3Rpb24obGxpYnJlKSB7XG5cbiAgICAgICAgTGxpYnJlc1NlcnZpY2UubGxpYnJlRWRpdGFyID0gbGxpYnJlO1xuICAgICAgICBcbiAgICAgICAgJGxvY2F0aW9uLnBhdGgoJy9lZGl0YXJMbGlicmUnKTtcbiAgICAgICAgXG4gICAgfTtcbn0pOyIsImFuZ3VsYXIubW9kdWxlKCdhcHAnKVxuLnNlcnZpY2UoXCJMbGlicmVzU2VydmljZVwiLCBmdW5jdGlvbigkaHR0cCkge1xuICAgIHRoaXMuZmV0Y2ggPSBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuICRodHRwLmdldChcIi9hcGkvbGxpYnJlc1wiKTtcbiAgICB9O1xuICAgIHRoaXMuY3JlYXRlID0gZnVuY3Rpb24obGxpYnJlKSB7XG4gICAgICAgIHJldHVybiAkaHR0cC5wb3N0KFwiL2FwaS9sbGlicmVzXCIsIGxsaWJyZSk7XG4gICAgfTtcbiAgICB0aGlzLmRlbGV0ZSA9IGZ1bmN0aW9uKGlzYm4pIHtcbiAgICAgICAgcmV0dXJuICRodHRwLmRlbGV0ZShcIi9hcGkvbGxpYnJlcy9cIiArIGlzYm4pO1xuICAgIH07XG4gICAgLy8gTGkgcGFzc2VtIHVuIGpzb24gaSBlbCBpZCBkZWwgbGxpYnJlIHF1ZSB2b2xlbSBlZGl0YXJcbiAgICB0aGlzLnVwZGF0ZSA9IGZ1bmN0aW9uKGlzYm4sIGxsaWJyZSkge1xuICAgICAgICByZXR1cm4gJGh0dHAucHV0KFwiL2FwaS9sbGlicmVzL1wiICsgaXNibiwgbGxpYnJlKTtcbiAgICB9O1xuICAgIHRoaXMubGxpYnJlRWRpdGFyID0gbnVsbDtcbn0pOyIsImFuZ3VsYXIubW9kdWxlKCdhcHAnKVxuICAgIC5jb250cm9sbGVyKFwiTG9naW5TZXNzaW9uXCIsIGZ1bmN0aW9uKCRzY29wZSwgJGxvY2F0aW9uLCBVc2Vyc1NlcnZpY2UpIHtcbiAgICAgICAgICRzY29wZS4kd2F0Y2hHcm91cChbJ3VzZXJuYW1lJywncGFzc3dvcmQnXSxmdW5jdGlvbihuZXdWYWwsIG9sZFZhbCkge1xuICAgICAgICAgICAgICAgIC8qXG4gICAgICAgICAgICAgICAgICogVmlnaWxlbSBsZXMgdmFyaWFibGVzIGRlIGwnJHNjb3BlIFwidXNlcm5hbWVcIlxuICAgICAgICAgICAgICAgICAqIGkgXCJwYXNzd29yZFwiIHBlciBlc2JvcnJhciBlbCBtaXNzYXRnZSBkJ2Vycm9yXG4gICAgICAgICAgICAgICAgICogc2kgaGkgaGEuXG4gICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgaWYgKG5ld1ZhbCE9b2xkVmFsKVxuICAgICAgICAgICAgICAgICAgICAkc2NvcGUuZXJyb3I9bnVsbDtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAkc2NvcGUubG9naW4gPSBmdW5jdGlvbih1c2VybmFtZSwgcGFzc3dvcmQpIHtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYgKCF1c2VybmFtZSB8fCAhcGFzc3dvcmQpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyh1c2VybmFtZSk7XG4gICAgICAgICAgICAgICAgdXNlcm5hbWUgPSBudWxsO1xuICAgICAgICAgICAgICAgIHBhc3N3b3JkID0gbnVsbDtcblxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBVc2Vyc1NlcnZpY2UubG9naW4odXNlcm5hbWUscGFzc3dvcmQsXG4gICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uKGVycm9yLHN0YXR1cykge1xuICAgICAgICAgICAgICAgICAgICAgICAgLypcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBGdW5jacOzIHF1ZSBzJ2V4ZWN1dGFyw6Agc2kgaGkgaGEgdW4gZXJyb3IgZW4gZWwgbG9naW5cbiAgICAgICAgICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoc3RhdHVzID09IDQwMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUuZXJyb3IgPSBlcnJvci5taXNzYXRnZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSkuc3VjY2VzcyhmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFVzZXJzU2VydmljZS5nZXRVc2VyKCkudGhlbihmdW5jdGlvbih1c2VyKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBTaSB0b3QgdmEgYsOpLCBhbmVtIGEgbGEgcMOgZ2luYSBwcmluY2lwYWxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaSBlbWV0ZW4gdW4gbWlzc2F0Z2UgZGUgXCJsb2dpblwiIHBlciBhdmlzYXJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYSBsYSBub3N0cmEgYXBwIHF1ZSBsJ3VzdWFyaSBoYSBmZXQgbG9naW5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29ycmVjdGFtZW50LlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLiRlbWl0KCdsb2dpbicsIHVzZXIuZGF0YSk7ICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkbG9jYXRpb24ucGF0aCgnLycpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICAkc2NvcGUuY2FuY2VsYXJMb2dpbiA9IGZ1bmN0aW9uKHVzZXIpIHtcblxuICAgICAgICAgICAgJGxvY2F0aW9uLnBhdGgoJy8nKTtcblxuICAgICAgICB9O1xuICAgIH0pOyIsImFuZ3VsYXIubW9kdWxlKCdhcHAnKVxuLmNvbnRyb2xsZXIoJ05ld0F1dG9yJywgZnVuY3Rpb24oJHNjb3BlLCAkbG9jYXRpb24sIEF1dG9yU2VydmljZSkge1xuICAgIFxuICAgIC8vRGVzZW52b2x1cGVtIGxhIGZ1bmNpbyBhZmVnaXJBdXRvclxuICAgICRzY29wZS5hZmVnaXJBdXRvciA9IGZ1bmN0aW9uKCkge1xuXG4gICAgICAgIGlmICgoJHNjb3BlLmF1dG9yTm9tICE9IHVuZGVmaW5lZCkgJiAoJHNjb3BlLmF1dG9yQ29nbm9tICE9IHVuZGVmaW5lZCkpIHtcblxuICAgICAgICAgICBBdXRvclNlcnZpY2UuY3JlYXRlKHtcbiAgICAgICAgICAgICAgICBcIm5vbVwiOiAkc2NvcGUuYXV0b3JOb20sXG4gICAgICAgICAgICAgICAgXCJjb2dub21zXCI6ICRzY29wZS5hdXRvckNvZ25vbVxuICAgICAgICAgICAgfSkuc3VjY2VzcyhmdW5jdGlvbihhdXRvcnMpIHtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAkc2NvcGUuYXV0b3JOb20gPSBudWxsO1xuICAgICAgICAgICAgICAgICRzY29wZS5hdXRvckNvZ25vbSA9IG51bGw7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgJGxvY2F0aW9uLnBhdGgoJy9sbGlzdGFBdXRvcnMnKTtcbiAgICB9O1xuICAgIFxuICAgIC8vQ2FuY2VsZW0gbCdhY2Npw7MgUE9TVFxuICAgICRzY29wZS5jYW5jZWxhckF1dG9yID0gZnVuY3Rpb24oYXV0b3JzKSB7XG5cbiAgICAgICAkbG9jYXRpb24ucGF0aCgnL2xsaXN0YUF1dG9ycycpO1xuICAgIH07XG59KTsiLCJhbmd1bGFyLm1vZHVsZSgnYXBwJylcbi5jb250cm9sbGVyKCdOZXdCb29rJywgZnVuY3Rpb24oJHNjb3BlLCAkbG9jYXRpb24sIExsaWJyZXNTZXJ2aWNlLCBBdXRvclNlcnZpY2UpIHtcblxuICAgIEF1dG9yU2VydmljZS5mZXRjaCgpXG4gICAgICAgIC5zdWNjZXNzKGZ1bmN0aW9uKGF1dG9ycykge1xuICAgICAgICAgICAgJHNjb3BlLmF1dG9ycyA9IGF1dG9ycztcbiAgICAgICAgfSk7XG4gICAgXG4gICAgLy9EZXNlbnZvbHVwZW0gbGEgZnVuY2lvIGFmZWdpckxsaWJyZVxuICAgICRzY29wZS5hZmVnaXJMbGlicmUgPSBmdW5jdGlvbigpIHtcblxuICAgICAgICBpZiAoKCRzY29wZS5sbGlicmVUaXRvbCAhPSB1bmRlZmluZWQpICYgKCRzY29wZS5sbGlicmVJc2JuICE9IHVuZGVmaW5lZCkpIHtcblxuICAgICAgICAgICAgTGxpYnJlc1NlcnZpY2UuY3JlYXRlKHtcbiAgICAgICAgICAgICAgICBcInRpdG9sXCI6ICRzY29wZS5sbGlicmVUaXRvbCxcbiAgICAgICAgICAgICAgICBcImlzYm5cIjogJHNjb3BlLmxsaWJyZUlzYm4sXG4gICAgICAgICAgICAgICAgXCJhdXRvcnNcIiA6ICRzY29wZS5sbGlicmVBdXRvclxuICAgICAgICAgICAgfSkuc3VjY2VzcyhmdW5jdGlvbihsbGlicmUpIHtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAkc2NvcGUubGxpYnJlSXNibiA9IG51bGw7XG4gICAgICAgICAgICAgICAgJHNjb3BlLmxsaWJyZVRpdG9sID0gbnVsbDtcbiAgICAgICAgICAgICAgICAkc2NvcGUubGxpYnJlQXV0b3IgPSBudWxsO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgICRsb2NhdGlvbi5wYXRoKCcvJyk7XG4gICAgfTtcbiAgICBcbiAgICAvL0NhbmNlbGVtIGwnYWNjacOzIFBPU1RcbiAgICAkc2NvcGUuY2FuY2VsYXJMbGlicmUgPSBmdW5jdGlvbihsbGlicmUpIHtcblxuICAgICAgICRsb2NhdGlvbi5wYXRoKCcvJyk7XG4gICAgfTtcbn0pOyIsImFuZ3VsYXIubW9kdWxlKCdhcHAnKVxuICAgIC5jb250cm9sbGVyKCdOZXdVc2VyJywgZnVuY3Rpb24oJHNjb3BlLCAkbG9jYXRpb24sIFVzZXJzU2VydmljZSkge1xuXG4gICAgICAgIC8vRGVzZW52b2x1cGVtIGxhIGZ1bmNpbyBub3VVc3VhcmlcbiAgICAgICAgJHNjb3BlLm5vdVVzdWFyaSA9IGZ1bmN0aW9uKCkge1xuXG4gICAgICAgICAgICBpZiAoKCRzY29wZS5yZWdVc2VyICE9IHVuZGVmaW5lZCkgJiAoJHNjb3BlLnJlZ1Bhc3N3ZCAhPSB1bmRlZmluZWQpICYgKCRzY29wZS5jb25mUGFzc3dkICE9IHVuZGVmaW5lZCkpIHtcblxuICAgICAgICAgICAgICAgIGlmICgkc2NvcGUucmVnUGFzc3dkID09PSAkc2NvcGUuY29uZlBhc3N3ZCkge1xuXG4gICAgICAgICAgICAgICAgICAgIFVzZXJzU2VydmljZS5jcmVhdGUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJ1c2VybmFtZVwiOiAkc2NvcGUucmVnVXNlcixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicGFzc3dvcmRcIjogJHNjb3BlLnJlZ1Bhc3N3ZFxuICAgICAgICAgICAgICAgICAgICB9KS5zdWNjZXNzKGZ1bmN0aW9uKHVzZXIpIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLnJlZ1VzZXIgPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLnJlZ1Bhc3N3ZCA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUuY29uZlBhc3N3ZCA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgICRsb2NhdGlvbi5wYXRoKCcvJyk7XG5cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5yZWdVc2VyID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLnJlZ1Bhc3N3ZCA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5jb25mUGFzc3dkID0gbnVsbDtcblxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkVycm9yOiBsZXMgY29udHJhc2VueWVzIHNvbiBkaWZlcmVudHNcIik7XG5cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgLy9DYW5jZWxlbSBsJ2FjY2nDsyBQT1NUXG4gICAgICAgICRzY29wZS5jYW5jZWxhclVzdWFyaSA9IGZ1bmN0aW9uKHVzZXIpIHtcblxuICAgICAgICAgICAgJGxvY2F0aW9uLnBhdGgoJy8nKTtcblxuICAgICAgICB9O1xuICAgIH0pOyIsImFuZ3VsYXIubW9kdWxlKCdhcHAnKVxuICAgIC5jb25maWcoZnVuY3Rpb24oJHJvdXRlUHJvdmlkZXIsICRsb2NhdGlvblByb3ZpZGVyKSB7XG4gICAgICAgICRyb3V0ZVByb3ZpZGVyXG4gICAgICAgICAgICAud2hlbihcIi9cIiwge1xuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdMaXN0Qm9va3MnLFxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnbGlzdC5odG1sJyxcbiAgICAgICAgICAgICAgICBhdXRvcml0emF0OiBmYWxzZVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC53aGVuKFwiL2xsaXN0YUF1dG9yc1wiLCB7XG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ0xpc3RBdXRvcnMnLFxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnbGlzdEF1dG9ycy5odG1sJyxcbiAgICAgICAgICAgICAgICBhdXRvcml0emF0OiBmYWxzZVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC53aGVuKFwiL2VkaXRhckxsaWJyZVwiLCB7XG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ0VkaXRCb29rcycsXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdlZGl0Lmh0bWwnLFxuICAgICAgICAgICAgICAgIGF1dG9yaXR6YXQ6IHRydWVcblxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC53aGVuKFwiL2VkaXRBdXRvclwiLCB7XG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ0VkaXRBdXRvcicsXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdlZGl0QXV0b3IuaHRtbCcsXG4gICAgICAgICAgICAgICAgYXV0b3JpdHphdDogdHJ1ZVxuXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLndoZW4oXCIvbm91QXV0b3JcIiwge1xuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdOZXdBdXRvcicsXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICduZXdBdXRvci5odG1sJyxcbiAgICAgICAgICAgICAgICBhdXRvcml0emF0OiB0cnVlXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLndoZW4oXCIvbm91TGxpYnJlXCIsIHtcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnTmV3Qm9vaycsXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICduZXcuaHRtbCcsXG4gICAgICAgICAgICAgICAgYXV0b3JpdHphdDogdHJ1ZVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC53aGVuKFwiL2luaWNpYXJTZXNzaW9cIiwge1xuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdMb2dpblNlc3Npb24nLFxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnbG9naW4uaHRtbCcsXG4gICAgICAgICAgICAgICAgYXV0b3JpdHphdDogZmFsc2VcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAud2hlbihcIi91c3VhcmlOb3VcIiwge1xuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdOZXdVc2VyJyxcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3JlZ2lzdGVyLmh0bWwnLFxuICAgICAgICAgICAgICAgIGF1dG9yaXR6YXQ6IGZhbHNlXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLm90aGVyd2lzZSh7XG4gICAgICAgICAgICAgICAgcmVkaXJlY3RUbzogJy8nXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAkbG9jYXRpb25Qcm92aWRlci5odG1sNU1vZGUoe1xuICAgICAgICAgICAgZW5hYmxlZDogdHJ1ZSxcbiAgICAgICAgICAgIHJlcXVpcmVCYXNlOiBmYWxzZVxuICAgICAgICB9KTtcbiAgICB9KS5ydW4oZnVuY3Rpb24oJHJvb3RTY29wZSxVc2Vyc1NlcnZpY2UpIHtcbiAgICAgICAgLypcbiAgICAgICAgICAgIENhZGEgdmVnYWRhIHF1ZSBjYW52aWVtIGRlIHDDoGdpbmEgc2UgZGlzcGFyYSBlbFxuICAgICAgICAgICAgZXZlbnQgJHJvdXRlQ2hhbmdlU3RhcnQsXG4gICAgICAgICAgICBTaSBsYSBww6BnaW5hIHF1ZSB2b2xlbSB2ZXVyZSB0w6kgbGEgcHJvcGlldGF0IFxuICAgICAgICAgICAgXCJhdXRvcml0emF0XCI6IGEgdHJ1ZSBpIG5vIGhvIGVzdMOgIGxsYXZvcnMgbm8gXG4gICAgICAgICAgICBmYXLDoCBlbCBjYW52aVxuICAgICAgICAqL1xuICAgICAgICAkcm9vdFNjb3BlLiRvbignJHJvdXRlQ2hhbmdlU3RhcnQnLCBmdW5jdGlvbihldmVudCwgbmV4dCkge1xuICAgICAgICAgICBpZiAobmV4dClcbiAgICAgICAgICAgICAgICBpZiAoIVVzZXJzU2VydmljZS5hdXRoICYgbmV4dC5hdXRvcml0emF0KSBcbiAgICAgICAgICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgfSk7XG4gICAgfSk7IiwiYW5ndWxhci5tb2R1bGUoJ2FwcCcpXG4gICAgLnNlcnZpY2UoXCJVc2Vyc1NlcnZpY2VcIiwgZnVuY3Rpb24oJGh0dHApIHtcbiAgICAgICAgdmFyIHNydiA9IHRoaXM7XG4gICAgICAgIHNydi5hdXRoID0gZmFsc2U7XG4gICAgICAgIHRoaXMuZ2V0VXNlciA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuICRodHRwLmdldChcIi9hcGkvdXNlcnNcIik7XG4gICAgICAgIH07XG4gICAgICAgIHNydi5sb2dpbiA9IGZ1bmN0aW9uKHVzZXJuYW1lLCBwYXNzd29yZCwgbm9Mb2dpbikge1xuXG4gICAgICAgICAgICByZXR1cm4gJGh0dHAucG9zdCgnL2FwaS9zZXNzaW9ucycsIHtcbiAgICAgICAgICAgICAgICB1c2VybmFtZTogdXNlcm5hbWUsXG4gICAgICAgICAgICAgICAgcGFzc3dvcmQ6IHBhc3N3b3JkXG4gICAgICAgICAgICB9KS5zdWNjZXNzKGZ1bmN0aW9uKGRhdGEsIHN0YXR1cykge1xuICAgICAgICAgICAgICAgIC8qXG4gICAgICAgICAgICAgICAgICAgIFNpIGwnYXV0ZW50aWNhY2nDsyDDqXMgY29ycmVjdGUgbGkgZGllbSBhIGwnYW5ndWxhciBxdWUgY2FkYSBcbiAgICAgICAgICAgICAgICAgICAgdmVnYWRhIHF1ZSBlcyBjb211bmlxdWkgYW1iIGVsIHNlcnZpZG9yIGFmZWdlaXhpIGVsIHRva2VuIFxuICAgICAgICAgICAgICAgICAgICBhbCBoZWFkZXIgJ3gtYXV0aCdcbiAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgICRodHRwLmRlZmF1bHRzLmhlYWRlcnMuY29tbW9uWyd4LWF1dGgnXSA9IGRhdGE7XG4gICAgICAgICAgICAgICAgaWYgKGRhdGEpIHNydi5hdXRoID0gdHJ1ZTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLmNyZWF0ZSA9IGZ1bmN0aW9uKHVzZXIpIHtcbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5wb3N0KFwiL2FwaS91c2Vyc1wiLCB1c2VyKTtcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5sb2dPdXQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHNydi5hdXRoID0gZmFsc2U7XG4gICAgICAgICAgICAkaHR0cC5kZWZhdWx0cy5oZWFkZXJzLmNvbW1vblsneC1hdXRoJ10gPVwiXCI7XG4gICAgICAgIH07XG4gICAgfSk7Il0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9