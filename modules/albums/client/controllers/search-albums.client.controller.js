(function () {
  'use strict';

  angular
    .module('albums')
    .controller('AlbumsSearchController', AlbumsSearchController);

  AlbumsSearchController.$inject = ['AlbumsService'];

  function AlbumsSearchController(AlbumsService) {
    var vm = this;

    AlbumsService.search(function(a) { 
      vm.albums = a.albums.map(function(obj) { return obj._source; });
    });
  }
})();
