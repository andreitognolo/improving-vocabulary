exports.stack = function (t) {

  t.module("simpleTest");

  t.test('two should equal two', function () {
    t.equal(2, 2);
  });

  t.asyncTest("asynchronous test: two hundred ms later!", function (assert) {
    setTimeout(function () {
      assert.equal(1, 1);
      QUnit.start();
    }, 200);
  });
}


