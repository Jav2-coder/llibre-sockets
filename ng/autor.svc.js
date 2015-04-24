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