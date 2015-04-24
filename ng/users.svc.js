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