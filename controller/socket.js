module.exports = function(http) {
  var io = require("socket.io")(http); //sockect.io necessita http per funcionar
  return {
    nouLlibre: function(llibre) {
      console.log('new book event!');
      io.emit('newBook',llibre);
    },
    editarLlibre: function(llibre) {
      console.log('edit book event!');
      io.emit('editBook', llibre);
    },
    eliminarLlibre: function(llibre,p) {
      console.log('delete book event!');
      io.emit('deleteBook', llibre);
    }
  };
};
