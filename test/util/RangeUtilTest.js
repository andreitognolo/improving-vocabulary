var HOME = './../..';
var RangeUtil = require(HOME + '/server/util/RangeUtil');

exports.stack = function (t) {

  t.module('RangeUtil.addZeroToLeft');

  t.test('should return 0001 when value is 1', function () {
    t.strictEqual(RangeUtil.addZeroToLeft(1), '0001');
  });

  t.test('should return 0101 when value is 101', function () {
    t.strictEqual(RangeUtil.addZeroToLeft(101), '0101');
  });

  t.test('should return 1001 when value is 1001', function () {
    t.strictEqual(RangeUtil.addZeroToLeft(1001), '1001');
  });

  t.module('RangeUtil.min');

  t.test('min should be 0001 when value is 10', function () {
    t.strictEqual(RangeUtil.min(10), '0001');
  });

  t.test('min should be 0101 when value is 123', function () {
    t.strictEqual(RangeUtil.min(123), '0101');
  });

  t.test('min should be 1001 when value is 1037', function () {
    t.strictEqual(RangeUtil.min(1037), '1001');
  });

  t.module('RangeUtil.max');

  t.test('max should be 0100 when value is 10', function () {
    t.strictEqual(RangeUtil.max(10), '0100');
  });

  t.test('max should be 0200 when value is 123', function () {
    t.strictEqual(RangeUtil.max(123), '0200');
  });

  t.test('max should be 1100 when value is 1037', function () {
    t.strictEqual(RangeUtil.max(1037), '1100');
  });

}