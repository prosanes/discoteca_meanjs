(function () {
  'use strict';

  angular
    .module('albums')
    .controller('AlbumsSearchController', AlbumsSearchController);

  AlbumsSearchController.$inject = ['AlbumsService'];

  function AlbumsSearchController(AlbumsService) {
    var vm = this;

    vm.albums = [];

    vm.search = function() {
      var query = vm.query;
      AlbumsService.search({ query: query }, function(result) { 
        vm.albums = result.albums;
      });
    };
  }
})();
