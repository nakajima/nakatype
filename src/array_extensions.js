Object.extend(Array.prototype, {
  sum: function() {
    var values = this.select(Object.isNumber);
    return eval(values.join('+'));
  },
  
  mean: function() {
    var values = this.select(Object.isNumber);
    return values.sum() / values.length;
  },
  
  // TODO This might not be the most efficient algorithm.
  shuffle: function() {
    return this.sortBy(Math.random);
  },

  toSentence: function() {
    var copy = $A(this);
    var args = $A(arguments);
    var options = args[0] || { };
    options.delimiter = options.delimiter || ', ';
    options.joiner = options.joiner || 'and';
    if (copy.length < 2) { return copy; }

    var _ending = copy.pop();
    return copy.join(options.delimiter) + ' ' + options.joiner + ' ' + _ending;
  }
});