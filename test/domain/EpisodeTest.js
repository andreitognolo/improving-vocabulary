var HOME = './../..';
var Episode = require(HOME + '/server/domain/Episode');

exports.stack = function (t) {

  t.module("Episode.newEpisode - id");

  t.test('should set id with the fileName', function() {
    t.strictEqual(Episode.newEpisode(37).id, 37);
  });

  t.module("Episode.newEpisode - group");

  t.test('should set group as 0001-0100 when fileName is 37', function() {
    t.strictEqual(Episode.newEpisode(37).group, '0001-0100');
  });

  t.test('should set group as 0301-0400 when fileName is 350', function() {
    t.strictEqual(Episode.newEpisode(350).group, '0301-0400');
  });
}