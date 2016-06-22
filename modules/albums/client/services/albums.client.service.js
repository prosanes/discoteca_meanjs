//Albums service used to communicate Albums REST endpoints
(function () {
  'use strict';

  angular
    .module('albums')
    .factory('AlbumsService', AlbumsService);

  AlbumsService.$inject = ['$resource'];

  function AlbumsService($resource) {
    return $resource('api/albums/:albumId', {
      albumId: '@_id'
    }, {
      update: { method: 'PUT' },
      search: { method: 'GET', url: 'api/searchable_albums' }
    });
  }
})();
