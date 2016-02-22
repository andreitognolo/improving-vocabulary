exports.addZeroToLeft = addZeroToLeft;
exports.min = min;
exports.max = max;

function addZeroToLeft(value) {
  value = value.toString();

  var result = '';

  for (var i = 0; i < (4 - value.length); i++) {
    result += '0';
  }

  return result + value;
}

function min(value) {
  var min = (Math.floor(value / 100) * 100) + 1;
  return addZeroToLeft(min);
}

function max(value) {
  var max = (Math.floor(value / 100) + 1) * 100;
  return addZeroToLeft(max);
}
