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