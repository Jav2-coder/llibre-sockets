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