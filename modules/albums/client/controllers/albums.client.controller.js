(function () {
  'use strict';

  // Albums controller
  angular
    .module('albums')
    .controller('AlbumsController', AlbumsController);

  AlbumsController.$inject = ['$scope', '$state', 'Authentication', 'albumResolve'];

  function AlbumsController ($scope, $state, Authentication, album) {
    var vm = this;

    vm.authentication = Authentication;
    vm.album = album;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Album
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.album.$remove($state.go('albums.list'));
      }
    }

    // Save Album
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.albumForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.album._id) {
        vm.album.$update(successCallback, errorCallback);
      } else {
        vm.album.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('albums.view', {
          albumId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();
