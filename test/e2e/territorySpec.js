describe('Social Harvest Territory', function() {

  var ptor = protractor.getInstance();

  it('should load the territory overview dashbaord', function() {
    ptor.get('/#/territory/dashboard');
    expect(ptor.findElement(protractor.By.tagName('h1')).getText()).toBe('Territory Overview');
  });

});
