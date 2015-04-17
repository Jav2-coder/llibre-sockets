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