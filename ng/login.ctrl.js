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