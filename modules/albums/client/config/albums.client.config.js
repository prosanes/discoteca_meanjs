(function () {
  'use strict';

  angular
    .module('albums')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Albums',
      state: 'albums',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'albums', {
      title: 'List Albums',
      state: 'albums.list'
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'albums', {
      title: 'Search Albums',
      state: 'albums.search'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'albums', {
      title: 'Create Album',
      state: 'albums.create',
      roles: ['user']
    });
  }
})();
