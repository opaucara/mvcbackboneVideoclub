define([
  'jquery',
  'underscore',
  'backbone',
  'text!/templates/paginator/paginator.html'
], function($, _, Backbone, PaginatorHTML) {
  
  var PaginatorView = Backbone.View.extend({
    // Idicamos que queremos se cree dentro de un div
    tagName: 'div',
    className: 'span12',
    template: _.template(PaginatorHTML),
    //
    events: {
      'click .go-previous': 'goPreviousPage',
      'click .go-next'    : 'goNextPage',
      'click .page-number': 'gotoPageNumber'
    },

    initialize: function () {
      _.bindAll(this, ['loadPageNumbers']);

      this.listenTo(this.collection, 'sync', this.loadPageNumbers);
    },

    render: function () {

      this.loadPageNumbers();
      return this;
    },
    loadPageNumbers: function () {

      this.totalPages = Math.ceil(this.collection.totalItems / this.collection.pageSize);
      
      this.$el.html(this.template({
        totalItems: this.collection.totalItems,
        pageNumber: this.collection.pageNumber,
        pageSize: this.collection.pageSize,
        totalPages: this.totalPages
      }));
    },
    changePage: function (page) {
      
      if (page >= 1 && page <= this.totalPages) {

        this.tigger('changePage', page);
      }
      return false;
    },
    gotoPageNumber: function (evt) {
      
      this.changePage(Number($(evt.currentTarget).text());
    },
    goPreviousPage: function (evt) {
      
      var page = this.collection.pageNumber;
      this.changePage(page--);
      return false;
    },
    goNextPage: function (evt) {
      
      var page = this.collection.pageNumber;
      this.changePage(page++);
      return false;
    }
  });

  return PaginatorView;
});