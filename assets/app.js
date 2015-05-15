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
            });


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
angular.module('app')
    .service('LlibreSocket', function($rootScope) {
        var socket = io().connect();
        var llibre;
        socket.on('newBook', function(l){
            llibre = l;
            $rootScope.$broadcast('lista');
            $rootScope.$apply();
            console.log('new book!');
        });
        socket.on('editBook', function(l){
            llibre = l;
            $rootScope.$broadcast('lista');
            $rootScope.$apply();
            console.log('edit book!');
        });
        socket.on('deleteBook', function(l){
            llibre = l;
            $rootScope.$broadcast('lista');
            $rootScope.$apply();
            console.log('delete book');
        });
        return {
            getLlibre : function() {
                return llibre;
            }
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
    }).run(function($rootScope, UsersService) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS5qcyIsImFwcGxpY2F0aW9uLmN0cmwuanMiLCJhdXRvci5zdmMuanMiLCJlZGl0LmpzIiwiZWRpdEF1dG9yLmpzIiwibGlzdEF1dG9ycy5qcyIsImxpc3RCb29rcy5qcyIsImxsaWJyZS5zb2NrZXQuanMiLCJsbGlicmUuc3ZjLmpzIiwibG9naW4uY3RybC5qcyIsIm5ld0F1dG9yLmpzIiwibmV3Qm9vay5qcyIsIm5ld1VzZXIuanMiLCJyb3V0ZXMuanMiLCJ1c2Vycy5zdmMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN4Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2xDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzNCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN4REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMzQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMvQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMzQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2xDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDeENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJhcHAuanMiLCJzb3VyY2VzQ29udGVudCI6WyJhbmd1bGFyLm1vZHVsZSgnYXBwJywgWyduZ1JvdXRlJ10pOyIsImFuZ3VsYXIubW9kdWxlKCdhcHAnKVxuICAgIC5jb250cm9sbGVyKFwiQXBwbGljYXRpb25Db250cm9sbGVyXCIsIGZ1bmN0aW9uKCRzY29wZSwkbG9jYXRpb24sVXNlcnNTZXJ2aWNlKSB7XG4gICAgICAgICRzY29wZS4kb24oJ2xvZ2luJywgZnVuY3Rpb24oZSx1c2VyKSB7XG4gICAgICAgICAgICAvKlxuICAgICAgICAgICAgICAgIFF1YW4gcydoYSBmZXQgbG9naW4gcydlbWV0IGwnZXZlbnQgXCJsb2dpblwiXG4gICAgICAgICAgICAgICAgaSBhaXjDsiBmYSBxdWUgbGEgdmFyaWFibGUgZGUgbCdzY29wZSBcImN1cnJlbnRVc2VyXCJcbiAgICAgICAgICAgICAgICBsaSBkaWVtIHF1aW4gdXN1YXJpIHMnaGEgYXV0ZW50aWNhbnQsIGQnYXF1ZXN0YSBtYW5lcmFcbiAgICAgICAgICAgICAgICBmZW0gcXVlIGFwYXJlZ3VpbiBkaWZlcmVudHMgb3BjaW9ucyBhbCBtZW7DulxuICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICRzY29wZS5jdXJyZW50VXNlciA9IHVzZXI7XG4gICAgICAgIH0pO1xuICAgICAgICAkc2NvcGUubG9nb3V0ID0gZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIC8qXG4gICAgICAgICAgICAgICAgUXVhbiBmZW0gbG9nb3V0IGVzYm9ycmVtIGVsIHRva2VuIGkgbGEgdmFyaWFibGVcbiAgICAgICAgICAgICAgICBkZSBsJyRzY29wZSBcImN1cnJlbnRVc2VyXCIsIGQnYXF1ZXN0YSBmb3JtYSBkZXNhcGFyZWl4ZW5cbiAgICAgICAgICAgICAgICBlbHMgbWVuw7pzIHNlbnNpYmxlcyBhIGxhIGF1dGVudGljYWNpw7NcbiAgICAgICAgICAgICovXG4gICAgICAgICAgICBVc2Vyc1NlcnZpY2UubG9nT3V0KCk7XG4gICAgICAgICAgICBkZWxldGUgJHNjb3BlLmN1cnJlbnRVc2VyO1xuICAgICAgICAgICAgJGxvY2F0aW9uLnBhdGgoJy8nKTtcbiAgICAgICAgfTtcbiAgICB9KTsiLCJhbmd1bGFyLm1vZHVsZSgnYXBwJylcbi5zZXJ2aWNlKFwiQXV0b3JTZXJ2aWNlXCIsIGZ1bmN0aW9uKCRodHRwKSB7XG4gICAgdGhpcy5mZXRjaCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KFwiL2FwaS9hdXRvcnNcIik7XG4gICAgfTtcbiAgICB0aGlzLmNyZWF0ZSA9IGZ1bmN0aW9uKGF1dG9ycykge1xuICAgICAgICByZXR1cm4gJGh0dHAucG9zdChcIi9hcGkvYXV0b3JzXCIsIGF1dG9ycyk7XG4gICAgfTtcbiAgICB0aGlzLmRlbGV0ZSA9IGZ1bmN0aW9uKF9pZCkge1xuICAgICAgICByZXR1cm4gJGh0dHAuZGVsZXRlKFwiL2FwaS9hdXRvcnMvXCIgKyBfaWQpO1xuICAgIH07XG4gICAgLy8gTGkgcGFzc2VtIHVuIGpzb24gaSBlbCBpZCBkZWwgYXV0b3JzIHF1ZSB2b2xlbSBlZGl0YXJcbiAgICB0aGlzLnVwZGF0ZSA9IGZ1bmN0aW9uKF9pZCwgYXV0b3JzKSB7XG4gICAgICAgIHJldHVybiAkaHR0cC5wdXQoXCIvYXBpL2F1dG9ycy9cIiArIF9pZCwgYXV0b3JzKTtcbiAgICB9O1xuICAgIHRoaXMuYXV0b3JzRWRpdGFyID0gbnVsbDtcbn0pOyIsImFuZ3VsYXIubW9kdWxlKCdhcHAnKVxuICAgIC5jb250cm9sbGVyKCdFZGl0Qm9va3MnLCBmdW5jdGlvbigkc2NvcGUsICRsb2NhdGlvbiwgTGxpYnJlc1NlcnZpY2UsIEF1dG9yU2VydmljZSkge1xuICAgICAgIFxuICAgICAgICBBdXRvclNlcnZpY2UuZmV0Y2goKVxuICAgICAgICAuc3VjY2VzcyhmdW5jdGlvbihhdXRvcnMpIHtcbiAgICAgICAgICAgICRzY29wZS5hdXRvcnMgPSBhdXRvcnM7XG4gICAgICAgIH0pO1xuICAgICAgIFxuICAgICAgICAgICAgaWYgKExsaWJyZXNTZXJ2aWNlLmxsaWJyZUVkaXRhciA9PT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICRsb2NhdGlvbi5wYXRoKCcvJyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgICAkc2NvcGUuZWRpdGFyVGl0b2wgPSBMbGlicmVzU2VydmljZS5sbGlicmVFZGl0YXIudGl0b2w7XG4gICAgICAgICAgICAkc2NvcGUuZWRpdGFySXNibiA9IExsaWJyZXNTZXJ2aWNlLmxsaWJyZUVkaXRhci5pc2JuO1xuICAgICAgICAgICAgJHNjb3BlLmVkaXRhckF1dG9yID0gTGxpYnJlc1NlcnZpY2UubGxpYnJlRWRpdGFyLmF1dG9ycztcblxuICAgICAgICAgICAgJHNjb3BlLmxsaWJyZV9FZGl0YXIgPSBMbGlicmVzU2VydmljZS5sbGlicmVFZGl0YXI7XG59XG5cbiAgICAgICAgLy9DYW5jZWxlbSBsJ2FjY2nDsyBQVVRcbiAgICAgICAgJHNjb3BlLmNhbmNlbGFyRWRpY2lvID0gZnVuY3Rpb24obGxpYnJlKSB7XG4gICAgICAgICAgICBMbGlicmVzU2VydmljZS5sbGlicmVFZGl0YXIgPSBudWxsO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICAkbG9jYXRpb24ucGF0aCgnLycpO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8vIFRyYXNwYXNzZW0gaW5mb3JtYWNpw7MgYSBsZXMgdmFyaWFibGVzIGRlbCBIVE1MXG4gICAgICAgICRzY29wZS5hY3R1YWxpdHphckxsaWJyZSA9IGZ1bmN0aW9uKGxsaWJyZSkge1xuXG5cbiAgICAgICAgICAgIExsaWJyZXNTZXJ2aWNlLnVwZGF0ZSgkc2NvcGUubGxpYnJlX0VkaXRhci5pc2JuLCB7XG4gICAgICAgICAgICAgICAgXCJ0aXRvbFwiOiAkc2NvcGUuZWRpdGFyVGl0b2wsXG4gICAgICAgICAgICAgICAgXCJpc2JuXCI6ICRzY29wZS5lZGl0YXJJc2JuLFxuICAgICAgICAgICAgICAgIFwiYXV0b3JzXCI6ICRzY29wZS5lZGl0YXJBdXRvclxuICAgICAgICAgICAgfSk7XG5cblxuICAgICAgICAgICAgJGxvY2F0aW9uLnBhdGgoJy8nKTtcblxuICAgICAgICB9O1xuICAgIH0pOyIsImFuZ3VsYXIubW9kdWxlKCdhcHAnKVxuICAgIC5jb250cm9sbGVyKCdFZGl0QXV0b3InLCBmdW5jdGlvbigkc2NvcGUsICRsb2NhdGlvbiwgQXV0b3JTZXJ2aWNlKSB7XG4gICAgICAgXG4gICAgICAgICAgICBpZiAoQXV0b3JTZXJ2aWNlLmF1dG9yc0VkaXRhciA9PT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICRsb2NhdGlvbi5wYXRoKCcvbGxpc3RhQXV0b3JzJyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgICAkc2NvcGUuZWRpdGFyTm9tID0gQXV0b3JTZXJ2aWNlLmF1dG9yc0VkaXRhci5ub207XG4gICAgICAgICAgICAkc2NvcGUuZWRpdGFyQ29nbm9tID0gQXV0b3JTZXJ2aWNlLmF1dG9yc0VkaXRhci5jb2dub21zO1xuXG4gICAgICAgICAgICAkc2NvcGUuYXV0b3JfRWRpdGFyID0gQXV0b3JTZXJ2aWNlLmF1dG9yc0VkaXRhcjtcbn1cblxuICAgICAgICAvL0NhbmNlbGVtIGwnYWNjacOzIFBVVFxuICAgICAgICAkc2NvcGUuY2FuY2VsYXJBdXRvciA9IGZ1bmN0aW9uKGF1dG9ycykge1xuXG4gICAgICAgICAgICBBdXRvclNlcnZpY2UuYXV0b3JzRWRpdGFyID0gbnVsbDtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgJGxvY2F0aW9uLnBhdGgoJy9sbGlzdGFBdXRvcnMnKTtcbiAgICAgICAgfTtcblxuICAgICAgICAvLyBUcmFzcGFzc2VtIGluZm9ybWFjacOzIGEgbGVzIHZhcmlhYmxlcyBkZWwgSFRNTFxuICAgICAgICAkc2NvcGUuYWN0dWFsaXR6YXJBdXRvciA9IGZ1bmN0aW9uKGF1dG9ycykge1xuXG5cbiAgICAgICAgICAgIEF1dG9yU2VydmljZS51cGRhdGUoJHNjb3BlLmF1dG9yX0VkaXRhci5faWQsIHtcbiAgICAgICAgICAgICAgICBcIm5vbVwiOiAkc2NvcGUuZWRpdGFyTm9tLFxuICAgICAgICAgICAgICAgIFwiY29nbm9tc1wiOiAkc2NvcGUuZWRpdGFyQ29nbm9tXG4gICAgICAgICAgICB9KVxuXG5cbiAgICAgICAgICAgICRsb2NhdGlvbi5wYXRoKCcvbGxpc3RhQXV0b3JzJyk7XG5cbiAgICAgICAgfTtcbiAgICB9KTsiLCJhbmd1bGFyLm1vZHVsZSgnYXBwJylcbi5jb250cm9sbGVyKCdMaXN0QXV0b3JzJywgZnVuY3Rpb24oJHNjb3BlLCAkbG9jYXRpb24sIEF1dG9yU2VydmljZSkge1xuICAgIEF1dG9yU2VydmljZS5mZXRjaCgpXG4gICAgICAgIC5zdWNjZXNzKGZ1bmN0aW9uKGF1dG9ycykge1xuICAgICAgICAgICAgJHNjb3BlLmF1dG9ycyA9IGF1dG9ycztcbiAgICAgICAgfSlcbiAgICAgICAgLmVycm9yKGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGUpO1xuICAgICAgICB9KTtcbiAgICAgICAgXG4gICAgICAgICAgLy9EZXNlbnZvbHVwZW0gbGEgZnVuY2lvIGVzYm9ycmFyIGF1dG9yc1xuICAgICRzY29wZS5ib3JyYXJBdXRvciA9IGZ1bmN0aW9uKGF1dG9ycykge1xuY29uc29sZS5sb2coYXV0b3JzKTtcbiAgICAgICAgQXV0b3JTZXJ2aWNlLmRlbGV0ZShhdXRvcnMuX2lkKVxuICAgICAgICAgICAgLnN1Y2Nlc3MoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgJHNjb3BlLmF1dG9ycy5zcGxpY2UoJHNjb3BlLmF1dG9ycy5pbmRleE9mKGF1dG9ycyksIDEpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICB9O1xuICAgIC8vIFRyYXNwYXNzZW0gaW5mb3JtYWNpw7MgYSBsZXMgdmFyaWFibGVzIGRlbCBIVE1MXG4gICAgJHNjb3BlLmVkaXRhckF1dG9yID0gZnVuY3Rpb24oYXV0b3JzKSB7XG5cbiAgICAgICAgQXV0b3JTZXJ2aWNlLmF1dG9yc0VkaXRhciA9IGF1dG9ycztcbiAgICAgICAgXG4gICAgICAgICRsb2NhdGlvbi5wYXRoKCcvZWRpdEF1dG9yJyk7XG4gICAgICAgIFxuICAgIH07XG59KTsiLCJhbmd1bGFyLm1vZHVsZSgnYXBwJylcbiAgICAuY29udHJvbGxlcignTGlzdEJvb2tzJywgZnVuY3Rpb24oJHNjb3BlLCAkbG9jYXRpb24sIExsaWJyZXNTZXJ2aWNlLCBMbGlicmVTb2NrZXQpIHtcbiAgICAgICAgJHNjb3BlLmxsaWJyZXMgPSBbXTtcbiAgICAgICAgJHNjb3BlLiRvbignbGlzdGEnLCBmdW5jdGlvbihvKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnYWN0dWFsaXphciEnKTtcbiAgICAgICAgICAgIExsaWJyZXNTZXJ2aWNlLmZldGNoKClcbiAgICAgICAgICAgICAgICAuc3VjY2VzcyhmdW5jdGlvbihsbGlicmVzKSB7XG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5sbGlicmVzID0gbGxpYnJlcztcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5lcnJvcihmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGUpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgICAgTGxpYnJlc1NlcnZpY2UuZmV0Y2goKVxuICAgICAgICAgICAgLnN1Y2Nlc3MoZnVuY3Rpb24obGxpYnJlcykge1xuICAgICAgICAgICAgICAgICRzY29wZS5sbGlicmVzID0gbGxpYnJlcztcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuZXJyb3IoZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGUpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgLy9EZXNlbnZvbHVwZW0gbGEgZnVuY2lvIGVzYm9ycmFyIGxsaWJyZVxuICAgICAgICAkc2NvcGUuYm9ycmFyTGxpYnJlID0gZnVuY3Rpb24obGxpYnJlKSB7XG5cbiAgICAgICAgICAgIExsaWJyZXNTZXJ2aWNlLmRlbGV0ZShsbGlicmUuaXNibilcbiAgICAgICAgICAgICAgICAuc3VjY2VzcyhmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmxsaWJyZXMuc3BsaWNlKCRzY29wZS5sbGlicmVzLmluZGV4T2YobGxpYnJlKSwgMSk7XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgfTtcbiAgICAgICAgLy8gVHJhc3Bhc3NlbSBpbmZvcm1hY2nDsyBhIGxlcyB2YXJpYWJsZXMgZGVsIEhUTUxcbiAgICAgICAgJHNjb3BlLmVkaXRhckxsaWJyZSA9IGZ1bmN0aW9uKGxsaWJyZSkge1xuXG4gICAgICAgICAgICBMbGlicmVzU2VydmljZS5sbGlicmVFZGl0YXIgPSBsbGlicmU7XG4gICAgICAgICAgICAkbG9jYXRpb24ucGF0aCgnL2VkaXRhckxsaWJyZScpO1xuXG4gICAgICAgIH07XG4gICAgICAgICRzY29wZS4kb24oJ2RlbGV0ZUJvb2snLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBpO1xuICAgICAgICAgICAgZm9yIChpIGluICRzY29wZS5sbGlicmVzKSB7XG4gICAgICAgICAgICAgICAgaWYgKCRzY29wZS5sbGlicmVzW2ldLl9pZCA9PSBMbGlicmVTb2NrZXQuZ2V0TGxpYnJlKCkuX2lkKSB7XG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5sbGlicmVzLnNwbGljZShpLCAxKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICAkc2NvcGUuJG9uKCduZXdCb29rJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAkc2NvcGUubGxpYnJlcy5wdXNoKExsaWJyZVNvY2tldC5nZXRMbGlicmUoKSk7XG4gICAgICAgIH0pO1xuICAgICAgICAkc2NvcGUuJG9uKCdlZGl0Qm9vaycsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIGk7XG4gICAgICAgICAgICBmb3IgKGkgaW4gJHNjb3BlLmxsaWJyZXMpIHtcbiAgICAgICAgICAgICAgICBpZiAoJHNjb3BlLmxsaWJyZXNbaV0uX2lkID09IExsaWJyZVNvY2tldC5nZXRMbGlicmUoKS5faWQpIHtcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmxsaWJyZXNbaV0gPSBMbGlicmVTb2NrZXQuZ2V0TGxpYnJlKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9KTsiLCJhbmd1bGFyLm1vZHVsZSgnYXBwJylcbiAgICAuc2VydmljZSgnTGxpYnJlU29ja2V0JywgZnVuY3Rpb24oJHJvb3RTY29wZSkge1xuICAgICAgICB2YXIgc29ja2V0ID0gaW8oKS5jb25uZWN0KCk7XG4gICAgICAgIHZhciBsbGlicmU7XG4gICAgICAgIHNvY2tldC5vbignbmV3Qm9vaycsIGZ1bmN0aW9uKGwpe1xuICAgICAgICAgICAgbGxpYnJlID0gbDtcbiAgICAgICAgICAgICRyb290U2NvcGUuJGJyb2FkY2FzdCgnbGlzdGEnKTtcbiAgICAgICAgICAgICRyb290U2NvcGUuJGFwcGx5KCk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnbmV3IGJvb2shJyk7XG4gICAgICAgIH0pO1xuICAgICAgICBzb2NrZXQub24oJ2VkaXRCb29rJywgZnVuY3Rpb24obCl7XG4gICAgICAgICAgICBsbGlicmUgPSBsO1xuICAgICAgICAgICAgJHJvb3RTY29wZS4kYnJvYWRjYXN0KCdsaXN0YScpO1xuICAgICAgICAgICAgJHJvb3RTY29wZS4kYXBwbHkoKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdlZGl0IGJvb2shJyk7XG4gICAgICAgIH0pO1xuICAgICAgICBzb2NrZXQub24oJ2RlbGV0ZUJvb2snLCBmdW5jdGlvbihsKXtcbiAgICAgICAgICAgIGxsaWJyZSA9IGw7XG4gICAgICAgICAgICAkcm9vdFNjb3BlLiRicm9hZGNhc3QoJ2xpc3RhJyk7XG4gICAgICAgICAgICAkcm9vdFNjb3BlLiRhcHBseSgpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ2RlbGV0ZSBib29rJyk7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgZ2V0TGxpYnJlIDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGxsaWJyZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9KTsiLCJhbmd1bGFyLm1vZHVsZSgnYXBwJylcbi5zZXJ2aWNlKFwiTGxpYnJlc1NlcnZpY2VcIiwgZnVuY3Rpb24oJGh0dHApIHtcbiAgICB0aGlzLmZldGNoID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiAkaHR0cC5nZXQoXCIvYXBpL2xsaWJyZXNcIik7XG4gICAgfTtcbiAgICB0aGlzLmNyZWF0ZSA9IGZ1bmN0aW9uKGxsaWJyZSkge1xuICAgICAgICByZXR1cm4gJGh0dHAucG9zdChcIi9hcGkvbGxpYnJlc1wiLCBsbGlicmUpO1xuICAgIH07XG4gICAgdGhpcy5kZWxldGUgPSBmdW5jdGlvbihpc2JuKSB7XG4gICAgICAgIHJldHVybiAkaHR0cC5kZWxldGUoXCIvYXBpL2xsaWJyZXMvXCIgKyBpc2JuKTtcbiAgICB9O1xuICAgIC8vIExpIHBhc3NlbSB1biBqc29uIGkgZWwgaWQgZGVsIGxsaWJyZSBxdWUgdm9sZW0gZWRpdGFyXG4gICAgdGhpcy51cGRhdGUgPSBmdW5jdGlvbihpc2JuLCBsbGlicmUpIHtcbiAgICAgICAgcmV0dXJuICRodHRwLnB1dChcIi9hcGkvbGxpYnJlcy9cIiArIGlzYm4sIGxsaWJyZSk7XG4gICAgfTtcbiAgICB0aGlzLmxsaWJyZUVkaXRhciA9IG51bGw7XG59KTsiLCJhbmd1bGFyLm1vZHVsZSgnYXBwJylcbiAgICAuY29udHJvbGxlcihcIkxvZ2luU2Vzc2lvblwiLCBmdW5jdGlvbigkc2NvcGUsICRsb2NhdGlvbiwgVXNlcnNTZXJ2aWNlKSB7XG4gICAgICAgICAkc2NvcGUuJHdhdGNoR3JvdXAoWyd1c2VybmFtZScsJ3Bhc3N3b3JkJ10sZnVuY3Rpb24obmV3VmFsLCBvbGRWYWwpIHtcbiAgICAgICAgICAgICAgICAvKlxuICAgICAgICAgICAgICAgICAqIFZpZ2lsZW0gbGVzIHZhcmlhYmxlcyBkZSBsJyRzY29wZSBcInVzZXJuYW1lXCJcbiAgICAgICAgICAgICAgICAgKiBpIFwicGFzc3dvcmRcIiBwZXIgZXNib3JyYXIgZWwgbWlzc2F0Z2UgZCdlcnJvclxuICAgICAgICAgICAgICAgICAqIHNpIGhpIGhhLlxuICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgIGlmIChuZXdWYWwhPW9sZFZhbClcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmVycm9yPW51bGw7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgJHNjb3BlLmxvZ2luID0gZnVuY3Rpb24odXNlcm5hbWUsIHBhc3N3b3JkKSB7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGlmICghdXNlcm5hbWUgfHwgIXBhc3N3b3JkKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2codXNlcm5hbWUpO1xuICAgICAgICAgICAgICAgIHVzZXJuYW1lID0gbnVsbDtcbiAgICAgICAgICAgICAgICBwYXNzd29yZCA9IG51bGw7XG5cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgVXNlcnNTZXJ2aWNlLmxvZ2luKHVzZXJuYW1lLHBhc3N3b3JkLFxuICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbihlcnJvcixzdGF0dXMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8qXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgRnVuY2nDsyBxdWUgcydleGVjdXRhcsOgIHNpIGhpIGhhIHVuIGVycm9yIGVuIGVsIGxvZ2luXG4gICAgICAgICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHN0YXR1cyA9PSA0MDEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmVycm9yID0gZXJyb3IubWlzc2F0Z2U7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pLnN1Y2Nlc3MoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBVc2Vyc1NlcnZpY2UuZ2V0VXNlcigpLnRoZW4oZnVuY3Rpb24odXNlcil7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLypcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgU2kgdG90IHZhIGLDqSwgYW5lbSBhIGxhIHDDoGdpbmEgcHJpbmNpcGFsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGkgZW1ldGVuIHVuIG1pc3NhdGdlIGRlIFwibG9naW5cIiBwZXIgYXZpc2FyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGEgbGEgbm9zdHJhIGFwcCBxdWUgbCd1c3VhcmkgaGEgZmV0IGxvZ2luXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvcnJlY3RhbWVudC5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS4kZW1pdCgnbG9naW4nLCB1c2VyLmRhdGEpOyAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJGxvY2F0aW9uLnBhdGgoJy8nKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgJHNjb3BlLmNhbmNlbGFyTG9naW4gPSBmdW5jdGlvbih1c2VyKSB7XG5cbiAgICAgICAgICAgICRsb2NhdGlvbi5wYXRoKCcvJyk7XG5cbiAgICAgICAgfTtcbiAgICB9KTsiLCJhbmd1bGFyLm1vZHVsZSgnYXBwJylcbi5jb250cm9sbGVyKCdOZXdBdXRvcicsIGZ1bmN0aW9uKCRzY29wZSwgJGxvY2F0aW9uLCBBdXRvclNlcnZpY2UpIHtcbiAgICBcbiAgICAvL0Rlc2Vudm9sdXBlbSBsYSBmdW5jaW8gYWZlZ2lyQXV0b3JcbiAgICAkc2NvcGUuYWZlZ2lyQXV0b3IgPSBmdW5jdGlvbigpIHtcblxuICAgICAgICBpZiAoKCRzY29wZS5hdXRvck5vbSAhPSB1bmRlZmluZWQpICYgKCRzY29wZS5hdXRvckNvZ25vbSAhPSB1bmRlZmluZWQpKSB7XG5cbiAgICAgICAgICAgQXV0b3JTZXJ2aWNlLmNyZWF0ZSh7XG4gICAgICAgICAgICAgICAgXCJub21cIjogJHNjb3BlLmF1dG9yTm9tLFxuICAgICAgICAgICAgICAgIFwiY29nbm9tc1wiOiAkc2NvcGUuYXV0b3JDb2dub21cbiAgICAgICAgICAgIH0pLnN1Y2Nlc3MoZnVuY3Rpb24oYXV0b3JzKSB7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgJHNjb3BlLmF1dG9yTm9tID0gbnVsbDtcbiAgICAgICAgICAgICAgICAkc2NvcGUuYXV0b3JDb2dub20gPSBudWxsO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgICRsb2NhdGlvbi5wYXRoKCcvbGxpc3RhQXV0b3JzJyk7XG4gICAgfTtcbiAgICBcbiAgICAvL0NhbmNlbGVtIGwnYWNjacOzIFBPU1RcbiAgICAkc2NvcGUuY2FuY2VsYXJBdXRvciA9IGZ1bmN0aW9uKGF1dG9ycykge1xuXG4gICAgICAgJGxvY2F0aW9uLnBhdGgoJy9sbGlzdGFBdXRvcnMnKTtcbiAgICB9O1xufSk7IiwiYW5ndWxhci5tb2R1bGUoJ2FwcCcpXG4uY29udHJvbGxlcignTmV3Qm9vaycsIGZ1bmN0aW9uKCRzY29wZSwgJGxvY2F0aW9uLCBMbGlicmVzU2VydmljZSwgQXV0b3JTZXJ2aWNlKSB7XG5cbiAgICBBdXRvclNlcnZpY2UuZmV0Y2goKVxuICAgICAgICAuc3VjY2VzcyhmdW5jdGlvbihhdXRvcnMpIHtcbiAgICAgICAgICAgICRzY29wZS5hdXRvcnMgPSBhdXRvcnM7XG4gICAgICAgIH0pO1xuICAgIFxuICAgIC8vRGVzZW52b2x1cGVtIGxhIGZ1bmNpbyBhZmVnaXJMbGlicmVcbiAgICAkc2NvcGUuYWZlZ2lyTGxpYnJlID0gZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgaWYgKCgkc2NvcGUubGxpYnJlVGl0b2wgIT0gdW5kZWZpbmVkKSAmICgkc2NvcGUubGxpYnJlSXNibiAhPSB1bmRlZmluZWQpKSB7XG5cbiAgICAgICAgICAgIExsaWJyZXNTZXJ2aWNlLmNyZWF0ZSh7XG4gICAgICAgICAgICAgICAgXCJ0aXRvbFwiOiAkc2NvcGUubGxpYnJlVGl0b2wsXG4gICAgICAgICAgICAgICAgXCJpc2JuXCI6ICRzY29wZS5sbGlicmVJc2JuLFxuICAgICAgICAgICAgICAgIFwiYXV0b3JzXCIgOiAkc2NvcGUubGxpYnJlQXV0b3JcbiAgICAgICAgICAgIH0pLnN1Y2Nlc3MoZnVuY3Rpb24obGxpYnJlKSB7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgJHNjb3BlLmxsaWJyZUlzYm4gPSBudWxsO1xuICAgICAgICAgICAgICAgICRzY29wZS5sbGlicmVUaXRvbCA9IG51bGw7XG4gICAgICAgICAgICAgICAgJHNjb3BlLmxsaWJyZUF1dG9yID0gbnVsbDtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICAkbG9jYXRpb24ucGF0aCgnLycpO1xuICAgIH07XG4gICAgXG4gICAgLy9DYW5jZWxlbSBsJ2FjY2nDsyBQT1NUXG4gICAgJHNjb3BlLmNhbmNlbGFyTGxpYnJlID0gZnVuY3Rpb24obGxpYnJlKSB7XG5cbiAgICAgICAkbG9jYXRpb24ucGF0aCgnLycpO1xuICAgIH07XG59KTsiLCJhbmd1bGFyLm1vZHVsZSgnYXBwJylcbiAgICAuY29udHJvbGxlcignTmV3VXNlcicsIGZ1bmN0aW9uKCRzY29wZSwgJGxvY2F0aW9uLCBVc2Vyc1NlcnZpY2UpIHtcblxuICAgICAgICAvL0Rlc2Vudm9sdXBlbSBsYSBmdW5jaW8gbm91VXN1YXJpXG4gICAgICAgICRzY29wZS5ub3VVc3VhcmkgPSBmdW5jdGlvbigpIHtcblxuICAgICAgICAgICAgaWYgKCgkc2NvcGUucmVnVXNlciAhPSB1bmRlZmluZWQpICYgKCRzY29wZS5yZWdQYXNzd2QgIT0gdW5kZWZpbmVkKSAmICgkc2NvcGUuY29uZlBhc3N3ZCAhPSB1bmRlZmluZWQpKSB7XG5cbiAgICAgICAgICAgICAgICBpZiAoJHNjb3BlLnJlZ1Bhc3N3ZCA9PT0gJHNjb3BlLmNvbmZQYXNzd2QpIHtcblxuICAgICAgICAgICAgICAgICAgICBVc2Vyc1NlcnZpY2UuY3JlYXRlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFwidXNlcm5hbWVcIjogJHNjb3BlLnJlZ1VzZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInBhc3N3b3JkXCI6ICRzY29wZS5yZWdQYXNzd2RcbiAgICAgICAgICAgICAgICAgICAgfSkuc3VjY2VzcyhmdW5jdGlvbih1c2VyKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5yZWdVc2VyID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5yZWdQYXNzd2QgPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmNvbmZQYXNzd2QgPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICAkbG9jYXRpb24ucGF0aCgnLycpO1xuXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICAgICAgICAgICAgICAkc2NvcGUucmVnVXNlciA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5yZWdQYXNzd2QgPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICAkc2NvcGUuY29uZlBhc3N3ZCA9IG51bGw7XG5cbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJFcnJvcjogbGVzIGNvbnRyYXNlbnllcyBzb24gZGlmZXJlbnRzXCIpO1xuXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIC8vQ2FuY2VsZW0gbCdhY2Npw7MgUE9TVFxuICAgICAgICAkc2NvcGUuY2FuY2VsYXJVc3VhcmkgPSBmdW5jdGlvbih1c2VyKSB7XG5cbiAgICAgICAgICAgICRsb2NhdGlvbi5wYXRoKCcvJyk7XG5cbiAgICAgICAgfTtcbiAgICB9KTsiLCJhbmd1bGFyLm1vZHVsZSgnYXBwJylcbiAgICAuY29uZmlnKGZ1bmN0aW9uKCRyb3V0ZVByb3ZpZGVyLCAkbG9jYXRpb25Qcm92aWRlcikge1xuICAgICAgICAkcm91dGVQcm92aWRlclxuICAgICAgICAgICAgLndoZW4oXCIvXCIsIHtcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnTGlzdEJvb2tzJyxcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ2xpc3QuaHRtbCcsXG4gICAgICAgICAgICAgICAgYXV0b3JpdHphdDogZmFsc2VcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAud2hlbihcIi9sbGlzdGFBdXRvcnNcIiwge1xuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdMaXN0QXV0b3JzJyxcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ2xpc3RBdXRvcnMuaHRtbCcsXG4gICAgICAgICAgICAgICAgYXV0b3JpdHphdDogZmFsc2VcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAud2hlbihcIi9lZGl0YXJMbGlicmVcIiwge1xuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdFZGl0Qm9va3MnLFxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnZWRpdC5odG1sJyxcbiAgICAgICAgICAgICAgICBhdXRvcml0emF0OiB0cnVlXG5cbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAud2hlbihcIi9lZGl0QXV0b3JcIiwge1xuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdFZGl0QXV0b3InLFxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnZWRpdEF1dG9yLmh0bWwnLFxuICAgICAgICAgICAgICAgIGF1dG9yaXR6YXQ6IHRydWVcblxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC53aGVuKFwiL25vdUF1dG9yXCIsIHtcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnTmV3QXV0b3InLFxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnbmV3QXV0b3IuaHRtbCcsXG4gICAgICAgICAgICAgICAgYXV0b3JpdHphdDogdHJ1ZVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC53aGVuKFwiL25vdUxsaWJyZVwiLCB7XG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ05ld0Jvb2snLFxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnbmV3Lmh0bWwnLFxuICAgICAgICAgICAgICAgIGF1dG9yaXR6YXQ6IHRydWVcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAud2hlbihcIi9pbmljaWFyU2Vzc2lvXCIsIHtcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnTG9naW5TZXNzaW9uJyxcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ2xvZ2luLmh0bWwnLFxuICAgICAgICAgICAgICAgIGF1dG9yaXR6YXQ6IGZhbHNlXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLndoZW4oXCIvdXN1YXJpTm91XCIsIHtcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnTmV3VXNlcicsXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdyZWdpc3Rlci5odG1sJyxcbiAgICAgICAgICAgICAgICBhdXRvcml0emF0OiBmYWxzZVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5vdGhlcndpc2Uoe1xuICAgICAgICAgICAgICAgIHJlZGlyZWN0VG86ICcvJ1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgJGxvY2F0aW9uUHJvdmlkZXIuaHRtbDVNb2RlKHtcbiAgICAgICAgICAgIGVuYWJsZWQ6IHRydWUsXG4gICAgICAgICAgICByZXF1aXJlQmFzZTogZmFsc2VcbiAgICAgICAgfSk7XG4gICAgfSkucnVuKGZ1bmN0aW9uKCRyb290U2NvcGUsIFVzZXJzU2VydmljZSkge1xuICAgICAgICAvKlxuICAgICAgICAgICAgQ2FkYSB2ZWdhZGEgcXVlIGNhbnZpZW0gZGUgcMOgZ2luYSBzZSBkaXNwYXJhIGVsXG4gICAgICAgICAgICBldmVudCAkcm91dGVDaGFuZ2VTdGFydCxcbiAgICAgICAgICAgIFNpIGxhIHDDoGdpbmEgcXVlIHZvbGVtIHZldXJlIHTDqSBsYSBwcm9waWV0YXQgXG4gICAgICAgICAgICBcImF1dG9yaXR6YXRcIjogYSB0cnVlIGkgbm8gaG8gZXN0w6AgbGxhdm9ycyBubyBcbiAgICAgICAgICAgIGZhcsOgIGVsIGNhbnZpXG4gICAgICAgICovXG4gICAgICAgICRyb290U2NvcGUuJG9uKCckcm91dGVDaGFuZ2VTdGFydCcsIGZ1bmN0aW9uKGV2ZW50LCBuZXh0KSB7XG4gICAgICAgICAgIGlmIChuZXh0KVxuICAgICAgICAgICAgICAgIGlmICghVXNlcnNTZXJ2aWNlLmF1dGggJiBuZXh0LmF1dG9yaXR6YXQpIFxuICAgICAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICB9KTtcbiAgICB9KTsiLCJhbmd1bGFyLm1vZHVsZSgnYXBwJylcbiAgICAuc2VydmljZShcIlVzZXJzU2VydmljZVwiLCBmdW5jdGlvbigkaHR0cCkge1xuICAgICAgICB2YXIgc3J2ID0gdGhpcztcbiAgICAgICAgc3J2LmF1dGggPSBmYWxzZTtcbiAgICAgICAgdGhpcy5nZXRVc2VyID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KFwiL2FwaS91c2Vyc1wiKTtcbiAgICAgICAgfTtcbiAgICAgICAgc3J2LmxvZ2luID0gZnVuY3Rpb24odXNlcm5hbWUsIHBhc3N3b3JkLCBub0xvZ2luKSB7XG5cbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5wb3N0KCcvYXBpL3Nlc3Npb25zJywge1xuICAgICAgICAgICAgICAgIHVzZXJuYW1lOiB1c2VybmFtZSxcbiAgICAgICAgICAgICAgICBwYXNzd29yZDogcGFzc3dvcmRcbiAgICAgICAgICAgIH0pLnN1Y2Nlc3MoZnVuY3Rpb24oZGF0YSwgc3RhdHVzKSB7XG4gICAgICAgICAgICAgICAgLypcbiAgICAgICAgICAgICAgICAgICAgU2kgbCdhdXRlbnRpY2FjacOzIMOpcyBjb3JyZWN0ZSBsaSBkaWVtIGEgbCdhbmd1bGFyIHF1ZSBjYWRhIFxuICAgICAgICAgICAgICAgICAgICB2ZWdhZGEgcXVlIGVzIGNvbXVuaXF1aSBhbWIgZWwgc2Vydmlkb3IgYWZlZ2VpeGkgZWwgdG9rZW4gXG4gICAgICAgICAgICAgICAgICAgIGFsIGhlYWRlciAneC1hdXRoJ1xuICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgJGh0dHAuZGVmYXVsdHMuaGVhZGVycy5jb21tb25bJ3gtYXV0aCddID0gZGF0YTtcbiAgICAgICAgICAgICAgICBpZiAoZGF0YSkgc3J2LmF1dGggPSB0cnVlO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuY3JlYXRlID0gZnVuY3Rpb24odXNlcikge1xuICAgICAgICAgICAgcmV0dXJuICRodHRwLnBvc3QoXCIvYXBpL3VzZXJzXCIsIHVzZXIpO1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLmxvZ091dCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgc3J2LmF1dGggPSBmYWxzZTtcbiAgICAgICAgICAgICRodHRwLmRlZmF1bHRzLmhlYWRlcnMuY29tbW9uWyd4LWF1dGgnXSA9XCJcIjtcbiAgICAgICAgfTtcbiAgICB9KTsiXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=