"use strict";
var wd = require('wd')
  , asserters = wd.asserters;

var driver = wd.promiseChainRemote('localhost', 4723);
var caps = {
  platformName: 'iOS',
  platformVersion: '7.1',
  deviceName: 'iPhone Simulator',
  browserName: 'Safari'
};

driver
  .init(caps)
  .get("http://localhost:8080/")
  .elementById('publish').click()
  .waitForElementById('publishing', asserters.textInclude('Done!'), 1200000)
  .sleep(10000)
  .fin(function () { return driver.quit(); })
  .done();
