define([
  'underscore',
  'backbone',
  'localstorage'
], function(_, Backbone,LocalStorage) {

  var Movie = Backbone.Model.extend({
    //localStorage: new LocalStorage('Movies'),
    defaults: {
      title: '',
      year: 0,
      genre: '',
      poster: '',
      rating: 1
    }, 

    initialize: function( options ) {
      this.query = options.query; 
      /*this.on("invalid",function(model,error){
                alert(error);
            });*/
    },

    validate: function (attrs) {
      var year = new Date().getFullYear();
      
      var error = [];

      if (!attrs.title.trim()) {
        error.push({value: 'title', msj: 'Tenes que ingresar el titulo de la pelicula'});
      }
      if (!attrs.year || Number(attrs.year) > year) {
        error.push({value: 'year', msj: 'El a&ntilde;o de la pelicula debe ser menor o igual a ' + year});
      }
      if (!attrs.genre.trim()) {
        error.push({value: 'genre', msj: 'Tenes que ingresar el genero de la pelicua'});
      }
      if (isNaN(attrs.rating) || attrs.rating < 1 || attrs.rating > 5) {
        error.push({value: 'rating', msj: 'La calificaci&oacute;n de la pelicula debe estar entre 1 y 5'});
      }

      if (error.length > 0) {
        return error;
      }
    }
  });

  return Movie;
});