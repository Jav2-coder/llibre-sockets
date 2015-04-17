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