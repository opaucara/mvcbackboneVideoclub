define([
  'jquery',
  'underscore',
  'backbone',
  'modals',
  'collections/movie',
  'views/movieCollection',
  'views/movieForm',
  'views/movie',
  'views/paginatorView'
],
function ($, _, Backbone, Modals, MovieCollection, MovieColllectionView,
          MovieFormView, MovieDetailView, PaginatorView) {

  //
  var movieCollection = new MovieCollection([]);

  // MovieRouter, es una clase que mapea la URL para convertirlas en acciones
  // y dispara eventos cuando "coincide"
  var MovieRouter = Backbone.Router.extend({
    routes: {
      // Las acciones no agregan "Movie", por que el rotuer es "Movie"
      '': 'showCollectionView',
      'movies/detail/:id': 'showDetailView',
      'movies/new': 'showFormView',
      'movies/edit/:id': 'showFormView'
    },

    // Referencia para la vista actual
    currentView: null,

    // Oculta (add className hide), si estuviera, la vista actual
    // y muestra (remove className hide) la view indicada
    toggleView: function (viewName) {

      // Si hay una view mostrandose
      if (!!this.currentView) {
        this.currentView.$el.addClass('hide');
      }

      // Mostramos la vista indicada
      this.views[viewName].$el.removeClass('hide');

      // Indicamos la vista en curso
      this.currentView = this.views[viewName];
    },

    // Hash de vistas cargadas
    views: {},

    // Instancia, si no estuviese previamente creada, y renderiza
    // la vista MovieColllectioView
    showCollectionView: function () {
      this.loadPaginator();
      // Si no esta
      if (!this.views['collection']) {

        // Instanciamos
        this.views['collection'] = new MovieColllectionView({collection: movieCollection});

        // Renderizamos
        $('#main').append(this.views['collection'].render().el);
      }

      //
      movieCollection.fetch({dataType: 'jsonp'});

      // Cambiamos a esta vista
      this.toggleView('collection');
    },

    // Instancia, si no estuviese previamente creada, y renderiza
    // la vista MovieDetailView
    // Si no existiera una pelicula asociada al id, salta al listado
    showDetailView: function (id) {

      var model = new movieCollection.model({_id: id}),
        success = $.proxy(function (model) {

          // Si no esta
          if (!this.views['detail']) {

            // Instanciamos
            this.views['detail'] = new MovieDetailView({model: model});

            // Renderizamos
            $('#main').append(this.views['detail'].render().el);
          }

          // Cambiamos a esta vista
          this.toggleView('detail');
      }, this);

      // Validamos que la pelicula exista
      this.validateMovie(id, success);
    },

    // Instancia, si no estuviese previamente creada, y renderiza
    // la vista MovieFormView
    // Si no existiera una pelicula asociada al id, salta al listado
    showFormView: function (id) {

      var success = $.proxy(function (model) {

        // Si esta
        if (!!this.views['form']) {

          // Destruimos
          this.views['form'].remove();
        }

        // Instanciamos
        this.views['form'] = new MovieFormView({
          collection: movieCollection
          , model: model
        });

        // Renderizamos
        $('#main').append(this.views['form'].render().el);

        // Cambiamos a esta vista
        this.toggleView('form');
      }, this);

      // Si pasamos un id
      if (!!id) {

        // Validamos que la pelicula exista
        this.validateMovie(id, success);
      }
      else {
        success(false);
      }
    },

    //
    validateMovie: function (id, callback) {
      
      var model = new movieCollection.model({_id: id}),
        error = $.proxy(function () {

          // Mostramos el listado
          this.navigate('', {trigger: true});
        }, this);

      // Buscamos los datos de la pelicula
      model.fetch({
        success: function (model, resp, options) {

          callback(model);
        },
        error: error
      });
    },
    loadPaginator: function(){
      if (!this.views['paginator']) {

        // Instanciamos
        this.views['paginator'] = new PaginatorView({collection: movieCollection});

        // Renderizamos
        $('#main').append(this.views['paginator'].render().el);
      }
    }
  });

  var app = {
    initialize: function () {

      //
      $(document).on('ajaxSend', function () {
        Modals.loading({show: true});
      });
      $(document).on('ajaxComplete', function () {
        Modals.loading({show: false});
      });
      
      // Instanciamos
      var movieRouter = new MovieRouter();

      // Iniciamos
      Backbone.history.start();
    }
  };

  return app;
});
