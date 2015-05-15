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