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