(function () {
  'use strict';

  describe('Albums Route Tests', function () {
    // Initialize global variables
    var $scope,
      AlbumsService;

    //We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _AlbumsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      AlbumsService = _AlbumsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('albums');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/albums');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('View Route', function () {
        var viewstate,
          AlbumsController,
          mockAlbum;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('albums.view');
          $templateCache.put('modules/albums/client/views/view-album.client.view.html', '');

          // create mock Album
          mockAlbum = new AlbumsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Album Name'
          });

          //Initialize Controller
          AlbumsController = $controller('AlbumsController as vm', {
            $scope: $scope,
            albumResolve: mockAlbum
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:albumId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.albumResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            albumId: 1
          })).toEqual('/albums/1');
        }));

        it('should attach an Album to the controller scope', function () {
          expect($scope.vm.album._id).toBe(mockAlbum._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/albums/client/views/view-album.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          AlbumsController,
          mockAlbum;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('albums.create');
          $templateCache.put('modules/albums/client/views/form-album.client.view.html', '');

          // create mock Album
          mockAlbum = new AlbumsService();

          //Initialize Controller
          AlbumsController = $controller('AlbumsController as vm', {
            $scope: $scope,
            albumResolve: mockAlbum
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.albumResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/albums/create');
        }));

        it('should attach an Album to the controller scope', function () {
          expect($scope.vm.album._id).toBe(mockAlbum._id);
          expect($scope.vm.album._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/albums/client/views/form-album.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          AlbumsController,
          mockAlbum;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('albums.edit');
          $templateCache.put('modules/albums/client/views/form-album.client.view.html', '');

          // create mock Album
          mockAlbum = new AlbumsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Album Name'
          });

          //Initialize Controller
          AlbumsController = $controller('AlbumsController as vm', {
            $scope: $scope,
            albumResolve: mockAlbum
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:albumId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.albumResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            albumId: 1
          })).toEqual('/albums/1/edit');
        }));

        it('should attach an Album to the controller scope', function () {
          expect($scope.vm.album._id).toBe(mockAlbum._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/albums/client/views/form-album.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
})();
