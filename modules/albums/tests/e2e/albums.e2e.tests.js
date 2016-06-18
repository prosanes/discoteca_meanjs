'use strict';

describe('Albums E2E Tests:', function () {
  describe('Test Albums page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/albums');
      expect(element.all(by.repeater('album in albums')).count()).toEqual(0);
    });
  });
});
