(function () {
  'use strict';

  angular
    .module('albums')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('albums', {
        abstract: true,
        url: '/albums',
        template: '<ui-view/>'
      })
      .state('albums.list', {
        url: '',
        templateUrl: 'modules/albums/client/views/list-albums.client.view.html',
        controller: 'AlbumsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Albums List'
        }
      })
      .state('albums.search', {
        url: '^/searchable_albums',
        templateUrl: 'modules/albums/client/views/list-albums.client.view.html',
        controller: 'AlbumsSearchController',
        controllerAs: 'vm'
      })
      .state('albums.create', {
        url: '/create',
        templateUrl: 'modules/albums/client/views/form-album.client.view.html',
        controller: 'AlbumsController',
        controllerAs: 'vm',
        resolve: {
          albumResolve: newAlbum
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle : 'Albums Create'
        }
      })
      .state('albums.edit', {
        url: '/:albumId/edit',
        templateUrl: 'modules/albums/client/views/form-album.client.view.html',
        controller: 'AlbumsController',
        controllerAs: 'vm',
        resolve: {
          albumResolve: getAlbum
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Album {{ albumResolve.name }}'
        }
      })
      .state('albums.view', {
        url: '/:albumId',
        templateUrl: 'modules/albums/client/views/view-album.client.view.html',
        controller: 'AlbumsController',
        controllerAs: 'vm',
        resolve: {
          albumResolve: getAlbum
        },
        data:{
          pageTitle: 'Album {{ articleResolve.name }}'
        }
      });
  }

  getAlbum.$inject = ['$stateParams', 'AlbumsService'];

  function getAlbum($stateParams, AlbumsService) {
    return AlbumsService.get({
      albumId: $stateParams.albumId
    }).$promise;
  }

  newAlbum.$inject = ['AlbumsService'];

  function newAlbum(AlbumsService) {
    return new AlbumsService();
  }
})();
