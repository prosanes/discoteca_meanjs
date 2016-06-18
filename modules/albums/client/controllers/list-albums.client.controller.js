(function () {
  'use strict';

  angular
    .module('albums')
    .controller('AlbumsListController', AlbumsListController);

  AlbumsListController.$inject = ['AlbumsService'];

  function AlbumsListController(AlbumsService) {
    var vm = this;

    vm.albums = AlbumsService.query();
  }
})();
