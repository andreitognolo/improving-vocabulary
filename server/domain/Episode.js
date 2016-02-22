var RangeUtil = require('../util/RangeUtil');

function Episode() {

  this.collection = 'episode';

  this.id = undefined;

  this.group = undefined;

  this.transcripted = undefined;

  this.sentences = [];

}

Episode.prototype = {

  get words() {
    var words = [];
    var WordsUtil = require('../util/WordsUtil');

    this.sentences.forEach(function (sentence) {
      words = words.concat(WordsUtil.words(sentence.sentence));
    });

    return words;
  }

}

exports.newEpisode = function(fileName) {
  var episode = new Episode();

  // FIXME(Andrei) - It should raise an exception if fileName is not present
  if (!fileName) return episode;

  episode.id = fileName;

  var min = RangeUtil.min(fileName);
  var max = RangeUtil.max(fileName);
  episode.group = min + '-' + max;

  return episode;
};
